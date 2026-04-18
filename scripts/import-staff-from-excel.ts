import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type ParsedRow = {
  staff_code: string;
  full_name: string;
  position_name: string;
  department_name: string;
  neighborhood_name: string;
  phone: string;
  email: string;
  notes: string;
  status: 'active' | 'inactive';
};

const aliasMap: Record<keyof ParsedRow, string[]> = {
  staff_code: ['ma can bo', 'mã cán bộ', 'ma cb', 'staff_code', 'mã cb'],
  full_name: ['ho va ten', 'họ và tên', 'ten can bo', 'full_name', 'họ tên'],
  position_name: ['chuc danh', 'chức danh', 'chuc vu', 'chức vụ', 'position', 'position_name'],
  department_name: ['phong ban', 'phòng ban', 'don vi', 'đơn vị', 'department', 'department_name'],
  neighborhood_name: ['khu pho', 'khu phố', 'to dan pho', 'tổ dân phố', 'neighborhood', 'neighborhood_name'],
  phone: ['so dien thoai', 'số điện thoại', 'dien thoai', 'điện thoại', 'phone', 'mobile'],
  email: ['email', 'e-mail'],
  notes: ['ghi chu', 'ghi chú', 'notes', 'note'],
  status: ['trang thai', 'trạng thái', 'status'],
};

const normalize = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const findValue = (row: Record<string, unknown>, aliases: string[]) => {
  const normalizedAliases = aliases.map(normalize);
  for (const [key, value] of Object.entries(row)) {
    if (normalizedAliases.includes(normalize(key))) {
      return value;
    }
  }
  return '';
};

const parseRow = (row: Record<string, unknown>): ParsedRow => ({
  staff_code: String(findValue(row, aliasMap.staff_code) || '').trim(),
  full_name: String(findValue(row, aliasMap.full_name) || '').trim(),
  position_name: String(findValue(row, aliasMap.position_name) || '').trim(),
  department_name: String(findValue(row, aliasMap.department_name) || '').trim(),
  neighborhood_name: String(findValue(row, aliasMap.neighborhood_name) || '').trim(),
  phone: String(findValue(row, aliasMap.phone) || '').trim(),
  email: String(findValue(row, aliasMap.email) || '').trim(),
  notes: String(findValue(row, aliasMap.notes) || '').trim(),
  status: normalize(findValue(row, aliasMap.status)) === 'inactive' ? 'inactive' : 'active',
});

const args = process.argv.slice(2);
const filePathArg = args.find((arg) => !arg.startsWith('--'));
const dryRun = args.includes('--dry-run');
const sheetArg = args.find((arg) => arg.startsWith('--sheet='));
const sheetName = sheetArg ? sheetArg.split('=')[1] : undefined;

if (!filePathArg) {
  throw new Error('Usage: npx tsx scripts/import-staff-from-excel.ts <excel-file-path> [--sheet=Sheet1] [--dry-run]');
}

const filePath = path.resolve(process.cwd(), filePathArg);
if (!fs.existsSync(filePath)) {
  throw new Error(`Excel file not found: ${filePath}`);
}

async function main() {
  const workbook = XLSX.readFile(filePath);
  const targetSheet = sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[targetSheet];

  if (!worksheet) {
    throw new Error(`Sheet not found: ${targetSheet}`);
  }

  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });
  const parsedRows = rawRows.map(parseRow).filter((row) => row.full_name);

  const [{ data: departments }, { data: positions }, { data: neighborhoods }] = await Promise.all([
    supabase.from('departments').select('id, name'),
    supabase.from('positions').select('id, name'),
    supabase.from('neighborhoods').select('id, name'),
  ]);

  const departmentByName = new Map((departments || []).map((item) => [normalize(item.name), item.id]));
  const positionByName = new Map((positions || []).map((item) => [normalize(item.name), item.id]));
  const neighborhoodByName = new Map((neighborhoods || []).map((item) => [normalize(item.name), item.id]));

  let inserted = 0;
  let updated = 0;
  const skipped: string[] = [];

  for (const row of parsedRows) {
    const payload = {
      staff_code: row.staff_code || null,
      full_name: row.full_name,
      position_id: row.position_name ? positionByName.get(normalize(row.position_name)) || null : null,
      department_id: row.department_name ? departmentByName.get(normalize(row.department_name)) || null : null,
      neighborhood_id: row.neighborhood_name ? neighborhoodByName.get(normalize(row.neighborhood_name)) || null : null,
      phone: row.phone,
      email: row.email,
      notes: row.notes,
      status: row.status,
    };

    if (row.position_name && !payload.position_id) {
      skipped.push(`${row.full_name}: chua map duoc chuc danh "${row.position_name}"`);
      continue;
    }
    if (row.department_name && !payload.department_id) {
      skipped.push(`${row.full_name}: chua map duoc phong ban "${row.department_name}"`);
      continue;
    }
    if (row.neighborhood_name && !payload.neighborhood_id) {
      skipped.push(`${row.full_name}: chua map duoc khu pho "${row.neighborhood_name}"`);
      continue;
    }

    const matchers = [
      row.staff_code ? `staff_code.eq.${row.staff_code}` : '',
      row.phone ? `phone.eq.${row.phone}` : '',
      row.email ? `email.eq.${row.email}` : '',
    ].filter(Boolean);

    let existing: { id: number } | null = null;
    if (matchers.length) {
      const { data } = await supabase.from('staff').select('id').or(matchers.join(',')).limit(1).maybeSingle();
      existing = data;
    }

    if (dryRun) {
      if (existing) {
        updated += 1;
      } else {
        inserted += 1;
      }
      continue;
    }

    if (existing) {
      const { error } = await supabase.from('staff').update(payload).eq('id', existing.id);
      if (error) {
        skipped.push(`${row.full_name}: ${error.message}`);
        continue;
      }
      updated += 1;
    } else {
      const { data: insertedStaff, error } = await supabase.from('staff').insert(payload).select('id').single();
      if (error || !insertedStaff) {
        skipped.push(`${row.full_name}: ${error?.message || 'khong them duoc'}`);
        continue;
      }

      const username = row.phone || row.email || row.staff_code || `staff_${insertedStaff.id}`;
      const password = bcrypt.hashSync('123123', bcrypt.genSaltSync(10));
      const { error: userError } = await supabase.from('users').insert({
        username,
        password,
        role: 'staff',
        staff_id: insertedStaff.id,
      });

      if (userError) {
        skipped.push(`${row.full_name}: tao user that bai - ${userError.message}`);
      }

      inserted += 1;
    }
  }

  console.log(`Sheet: ${targetSheet}`);
  console.log(`Rows parsed: ${parsedRows.length}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped.length}`);

  if (skipped.length) {
    console.log('\nSkipped details:');
    for (const item of skipped) {
      console.log(`- ${item}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
