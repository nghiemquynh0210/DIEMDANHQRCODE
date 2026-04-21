require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'nghiemquynh0210@gmail.com',
    password: '123123'
  });
  if (authErr) { console.error('Login error:', authErr); return; }

  // 1. Fetch all positions
  const { data: positions, error } = await supabase.from('positions').select('*').order('id', { ascending: true });
  
  const grouped = {};
  for (const pos of positions) {
    const key = pos.name.trim().toLowerCase();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(pos);
  }

  // 2. Resolve duplicates
  for (const [key, group] of Object.entries(grouped)) {
    if (group.length > 1) {
      console.log(`\nDuplicate group found for "${key}":`, group.map(g => `${g.id}:${g.name}`).join(' | '));
      
      const primary = group[0];
      const duplicates = group.slice(1);

      for (const dup of duplicates) {
        console.log(`Merging dup id: ${dup.id} -> ${primary.id}`);
        // Update staff pointing to duplicate
        await supabase.from('staff').update({ position_id: primary.id }).eq('position_id', dup.id);
        await supabase.from('staff').update({ party_position_id: primary.id }).eq('party_position_id', dup.id);
        
        // Delete the duplicate
        await supabase.from('positions').delete().eq('id', dup.id);
      }
    }
  }

  // Also check if 'Đảng viên' exists.
  const dv = (positions || []).find(p => p.name.trim().toLowerCase() === 'đảng viên' && p.org_type === 'party');
  if (!dv) {
    console.log('Creating missing Đảng viên position...');
    await supabase.from('positions').insert({ name: 'Đảng viên', org_type: 'party', sort_order: 100 });
  }

  console.log('Cleanup complete!');
}

run();
