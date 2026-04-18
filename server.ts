import dotenv from "dotenv";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import os from "os";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "ubnd-phuong-an-phu-secret";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type JwtUser = {
  id: number;
  username: string;
  role: "admin" | "staff" | "viewer";
  staff_id?: number | null;
};

type RequestWithUser = express.Request & { user?: JwtUser };

const seedDepartments = [
  { name: "Thường trực UBND phường", description: "Lãnh đạo điều hành chung." },
  { name: "Văn phòng - Thống kê", description: "Tham mưu tổng hợp, văn thư, lịch công tác." },
  { name: "Tư pháp - Hộ tịch", description: "Nghiệp vụ tư pháp, hộ tịch." },
  { name: "Địa chính - Xây dựng - Đô thị", description: "Quản lý đất đai, xây dựng, trật tự đô thị." },
  { name: "Văn hóa - Xã hội", description: "Phụ trách văn hóa, xã hội, lao động." },
  { name: "Tài chính - Kế toán", description: "Ngân sách và quyết toán." },
  { name: "Công an phường", description: "An ninh trật tự." },
  { name: "Ban chỉ huy quân sự", description: "Quốc phòng, dân quân." },
];

const seedPositions = [
  { name: "Chủ tịch UBND phường", code: "CT", sort_order: 1 },
  { name: "Phó Chủ tịch UBND phường", code: "PCT", sort_order: 2 },
  { name: "Công chức Văn phòng - Thống kê", code: "VP", sort_order: 3 },
  { name: "Công chức Tư pháp - Hộ tịch", code: "TPHT", sort_order: 4 },
  { name: "Công chức Địa chính - Xây dựng", code: "DCXD", sort_order: 5 },
  { name: "Công chức Văn hóa - Xã hội", code: "VHXH", sort_order: 6 },
  { name: "Trưởng khu phố", code: "TKP", sort_order: 7 },
  { name: "Phó khu phố", code: "PKP", sort_order: 8 },
];

const seedNeighborhoods = [
  { name: "Khu phố 1", code: "KP1" },
  { name: "Khu phố 2", code: "KP2" },
  { name: "Khu phố 3", code: "KP3" },
  { name: "Khu phố 4", code: "KP4" },
  { name: "Khu phố 5", code: "KP5" },
];

const parseNumberArray = (input: unknown): number[] => {
  if (Array.isArray(input)) {
    return input
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item));
  }

  if (typeof input === "string" && input.trim()) {
    try {
      return parseNumberArray(JSON.parse(input));
    } catch {
      return [];
    }
  }

  return [];
};

const normalizeMeeting = (meeting: any) => ({
  ...meeting,
  participant_department_ids: parseNumberArray(meeting.participant_department_ids),
  participant_position_ids: parseNumberArray(meeting.participant_position_ids),
  participant_neighborhood_ids: parseNumberArray(meeting.participant_neighborhood_ids),
});

const mapStaff = (staff: any) => ({
  id: staff.id,
  staff_code: staff.staff_code,
  full_name: staff.full_name,
  phone: staff.phone || "",
  email: staff.email || "",
  department_id: staff.department_id,
  department_name: staff.departments?.name || null,
  position_id: staff.position_id,
  position_name: staff.positions?.name || null,
  neighborhood_id: staff.neighborhood_id,
  neighborhood_name: staff.neighborhoods?.name || null,
  status: staff.status || "active",
  notes: staff.notes || "",
  created_at: staff.created_at,
});

const mapAttendance = (attendance: any) => ({
  id: attendance.id,
  meeting_id: attendance.meeting_id,
  staff_id: attendance.staff_id,
  full_name: attendance.staff?.full_name || "",
  staff_code: attendance.staff?.staff_code || "",
  position_name: attendance.staff?.positions?.name || null,
  department_name: attendance.staff?.departments?.name || null,
  neighborhood_name: attendance.staff?.neighborhoods?.name || null,
  checkin_time: attendance.checkin_time,
  checkin_method: attendance.checkin_method,
  status: attendance.status,
});

const requireAuth = (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as JwtUser;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const requireAdmin = (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

async function ensureSeedData() {
  const adminPassword = bcrypt.hashSync("123123", bcrypt.genSaltSync(10));

  const [
    { count: departmentCount },
    { count: positionCount },
    { count: neighborhoodCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from("departments").select("*", { count: "exact", head: true }),
    supabase.from("positions").select("*", { count: "exact", head: true }),
    supabase.from("neighborhoods").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
  ]);

  if (!departmentCount) {
    await supabase.from("departments").insert(seedDepartments);
  }

  if (!positionCount) {
    await supabase.from("positions").insert(seedPositions);
  }

  if (!neighborhoodCount) {
    await supabase.from("neighborhoods").insert(seedNeighborhoods);
  }

  if (!userCount) {
    await supabase.from("users").insert({
      username: "admin",
      password: adminPassword,
      role: "admin",
    });
  } else {
    await supabase.from("users").update({ password: adminPassword }).eq("username", "admin");
  }

  const { count: staffCount } = await supabase.from("staff").select("*", { count: "exact", head: true });
  if (!staffCount) {
    const { data: departments } = await supabase.from("departments").select("id, name");
    const { data: positions } = await supabase.from("positions").select("id, name");
    const { data: neighborhoods } = await supabase.from("neighborhoods").select("id, name");

    const departmentByName = new Map((departments || []).map((item) => [item.name, item.id]));
    const positionByName = new Map((positions || []).map((item) => [item.name, item.id]));
    const neighborhoodByName = new Map((neighborhoods || []).map((item) => [item.name, item.id]));

    const seedStaff = [
      {
        staff_code: "AP-001",
        full_name: "Nguyen Van A",
        department_id: departmentByName.get("Thường trực UBND phường"),
        position_id: positionByName.get("Chủ tịch UBND phường"),
        neighborhood_id: null,
        phone: "0901000001",
        email: "nguyenvana@anphu.gov.vn",
        status: "active",
      },
      {
        staff_code: "AP-002",
        full_name: "Tran Thi B",
        department_id: departmentByName.get("Văn phòng - Thống kê"),
        position_id: positionByName.get("Công chức Văn phòng - Thống kê"),
        neighborhood_id: null,
        phone: "0901000002",
        email: "tranthib@anphu.gov.vn",
        status: "active",
      },
      {
        staff_code: "AP-KP1",
        full_name: "Le Van C",
        department_id: null,
        position_id: positionByName.get("Trưởng khu phố"),
        neighborhood_id: neighborhoodByName.get("Khu phố 1"),
        phone: "0901000003",
        email: "levanc@anphu.gov.vn",
        status: "active",
      },
    ];

    const { data: insertedStaff } = await supabase.from("staff").insert(seedStaff).select("id, phone, email");

    for (const item of insertedStaff || []) {
      const username = item.phone || item.email || `staff_${item.id}`;
      await supabase.from("users").insert({
        username,
        password: adminPassword,
        role: "staff",
        staff_id: item.id,
      });
    }
  }

  const { count: meetingCount } = await supabase.from("meetings").select("*", { count: "exact", head: true });
  if (!meetingCount) {
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("meetings").insert({
      title: "Hop giao ban UBND phuong",
      content: "Hop giao ban va trien khai nhiem vu tuan.",
      meeting_date: today,
      meeting_time: "08:00",
      location: "Hoi truong UBND phuong An Phu",
      participant_department_ids: [],
      participant_position_ids: [],
      participant_neighborhood_ids: [],
    });
  }
}

async function startServer() {
  await ensureSeedData();

  const app = express();
  app.use(express.json());

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    const { data: user, error } = await supabase.from("users").select("*").eq("username", username).maybeSingle();

    if (error || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Sai tai khoan hoac mat khau." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, staff_id: user.staff_id },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        staff_id: user.staff_id,
      },
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: RequestWithUser, res) => {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, role, staff_id")
      .eq("id", req.user!.id)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  });

  app.put("/api/auth/change-password", requireAuth, async (req: RequestWithUser, res) => {
    const { currentPassword, newPassword } = req.body;
    const { data: user, error } = await supabase.from("users").select("password").eq("id", req.user!.id).maybeSingle();

    if (error || !user || !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(400).json({ error: "Mat khau hien tai khong dung." });
    }

    const password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    const { error: updateError } = await supabase.from("users").update({ password }).eq("id", req.user!.id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.json({ success: true });
  });

  app.get("/api/users", requireAuth, requireAdmin, async (_req, res) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, role, staff_id")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  });

  app.put("/api/users/:id/reset-password", requireAuth, requireAdmin, async (req, res) => {
    const password = bcrypt.hashSync("123123", bcrypt.genSaltSync(10));
    const { error } = await supabase.from("users").update({ password }).eq("id", req.params.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  });

  app.get("/api/departments", async (_req, res) => {
    const { data, error } = await supabase.from("departments").select("*").order("name");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data || []);
  });

  app.post("/api/departments", requireAuth, async (req, res) => {
    const { name, description } = req.body;
    const { data, error } = await supabase.from("departments").insert({ name, description }).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  });

  app.put("/api/departments/:id", requireAuth, async (req, res) => {
    const { name, description } = req.body;
    const { error } = await supabase.from("departments").update({ name, description }).eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  });

  app.delete("/api/departments/:id", requireAuth, async (req, res) => {
    const { error } = await supabase.from("departments").delete().eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  });

  app.get("/api/positions", async (_req, res) => {
    const { data, error } = await supabase.from("positions").select("*").order("sort_order").order("name");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data || []);
  });

  app.post("/api/positions", requireAuth, async (req, res) => {
    const { name, code, description, sort_order } = req.body;
    const { data, error } = await supabase
      .from("positions")
      .insert({ name, code, description, sort_order: Number(sort_order) || 0 })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  });

  app.put("/api/positions/:id", requireAuth, async (req, res) => {
    const { name, code, description, sort_order } = req.body;
    const { error } = await supabase
      .from("positions")
      .update({ name, code, description, sort_order: Number(sort_order) || 0 })
      .eq("id", req.params.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  });

  app.delete("/api/positions/:id", requireAuth, async (req, res) => {
    const { error } = await supabase.from("positions").delete().eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  });

  app.get("/api/neighborhoods", async (_req, res) => {
    const { data, error } = await supabase.from("neighborhoods").select("*").order("name");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data || []);
  });

  app.post("/api/neighborhoods", requireAuth, async (req, res) => {
    const { name, code, description } = req.body;
    const { data, error } = await supabase.from("neighborhoods").insert({ name, code, description }).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  });

  app.put("/api/neighborhoods/:id", requireAuth, async (req, res) => {
    const { name, code, description } = req.body;
    const { error } = await supabase.from("neighborhoods").update({ name, code, description }).eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  });

  app.delete("/api/neighborhoods/:id", requireAuth, async (req, res) => {
    const { error } = await supabase.from("neighborhoods").delete().eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  });

  app.get("/api/staff", async (_req, res) => {
    const { data, error } = await supabase
      .from("staff")
      .select("*, departments(name), positions(name), neighborhoods(name)")
      .order("full_name");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json((data || []).map(mapStaff));
  });

  app.post("/api/staff", requireAuth, async (req, res) => {
    const payload = {
      staff_code: req.body.staff_code || null,
      full_name: req.body.full_name,
      department_id: req.body.department_id ? Number(req.body.department_id) : null,
      position_id: req.body.position_id ? Number(req.body.position_id) : null,
      neighborhood_id: req.body.neighborhood_id ? Number(req.body.neighborhood_id) : null,
      phone: req.body.phone || "",
      email: req.body.email || "",
      status: req.body.status || "active",
      notes: req.body.notes || "",
    };

    const { data: staff, error } = await supabase.from("staff").insert(payload).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const username = payload.phone || payload.email || payload.staff_code || `staff_${staff.id}`;
    const password = bcrypt.hashSync("123123", bcrypt.genSaltSync(10));
    await supabase.from("users").insert({ username, password, role: "staff", staff_id: staff.id });

    return res.json({ id: staff.id, username });
  });

  app.post("/api/staff/bulk", requireAuth, requireAdmin, async (req, res) => {
    const staffList = Array.isArray(req.body.staffList) ? req.body.staffList : [];
    let count = 0;

    for (const item of staffList) {
      const payload = {
        staff_code: item.staff_code || null,
        full_name: item.full_name,
        department_id: item.department_id ? Number(item.department_id) : null,
        position_id: item.position_id ? Number(item.position_id) : null,
        neighborhood_id: item.neighborhood_id ? Number(item.neighborhood_id) : null,
        phone: item.phone || "",
        email: item.email || "",
        status: item.status || "active",
        notes: item.notes || "",
      };

      if (!payload.full_name) {
        continue;
      }

      const { data: insertedStaff, error } = await supabase.from("staff").insert(payload).select().single();
      if (error || !insertedStaff) {
        continue;
      }

      const username = payload.phone || payload.email || payload.staff_code || `staff_${insertedStaff.id}`;
      const password = bcrypt.hashSync("123123", bcrypt.genSaltSync(10));
      await supabase.from("users").insert({ username, password, role: "staff", staff_id: insertedStaff.id });
      count += 1;
    }

    return res.json({ success: true, count });
  });

  app.put("/api/staff/:id", requireAuth, async (req, res) => {
    const payload = {
      staff_code: req.body.staff_code || null,
      full_name: req.body.full_name,
      department_id: req.body.department_id ? Number(req.body.department_id) : null,
      position_id: req.body.position_id ? Number(req.body.position_id) : null,
      neighborhood_id: req.body.neighborhood_id ? Number(req.body.neighborhood_id) : null,
      phone: req.body.phone || "",
      email: req.body.email || "",
      status: req.body.status || "active",
      notes: req.body.notes || "",
    };

    const { error } = await supabase.from("staff").update(payload).eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  });

  app.delete("/api/staff/:id", requireAuth, async (req, res) => {
    await supabase.from("users").delete().eq("staff_id", req.params.id);
    const { error } = await supabase.from("staff").delete().eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  });

  app.get("/api/meetings", async (_req, res) => {
    const { data, error } = await supabase.from("meetings").select("*").order("meeting_date", { ascending: false }).order("meeting_time", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json((data || []).map(normalizeMeeting));
  });

  app.post("/api/meetings", requireAuth, async (req: RequestWithUser, res) => {
    const payload = {
      title: req.body.title,
      content: req.body.content || "",
      location: req.body.location,
      meeting_date: req.body.meeting_date,
      meeting_time: req.body.meeting_time,
      participant_department_ids: parseNumberArray(req.body.participant_department_ids),
      participant_position_ids: parseNumberArray(req.body.participant_position_ids),
      participant_neighborhood_ids: parseNumberArray(req.body.participant_neighborhood_ids),
      created_by: req.user?.id || null,
    };

    const { data, error } = await supabase.from("meetings").insert(payload).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(normalizeMeeting(data));
  });

  app.put("/api/meetings/:id", requireAuth, async (req, res) => {
    const payload = {
      title: req.body.title,
      content: req.body.content || "",
      location: req.body.location,
      meeting_date: req.body.meeting_date,
      meeting_time: req.body.meeting_time,
      participant_department_ids: parseNumberArray(req.body.participant_department_ids),
      participant_position_ids: parseNumberArray(req.body.participant_position_ids),
      participant_neighborhood_ids: parseNumberArray(req.body.participant_neighborhood_ids),
    };

    const { error } = await supabase.from("meetings").update(payload).eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  });

  app.delete("/api/meetings/:id", requireAuth, async (req, res) => {
    await supabase.from("attendance").delete().eq("meeting_id", req.params.id);
    const { error } = await supabase.from("meetings").delete().eq("id", req.params.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  });

  app.get("/api/attendance/:meetingId", async (req, res) => {
    const { data, error } = await supabase
      .from("attendance")
      .select("*, staff(full_name, staff_code, departments(name), positions(name), neighborhoods(name))")
      .eq("meeting_id", req.params.meetingId)
      .order("checkin_time", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json((data || []).map(mapAttendance));
  });

  const createAttendance = async (
    meetingId: number,
    staffId: number,
    checkinMethod: "qr" | "manual" | "self",
  ) => {
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("meeting_id", meetingId)
      .eq("staff_id", staffId)
      .maybeSingle();

    if (existing) {
      return { error: "Nguoi nay da diem danh roi." };
    }

    const { data: meeting } = await supabase.from("meetings").select("*").eq("id", meetingId).maybeSingle();
    if (!meeting) {
      return { error: "Cuoc hop khong ton tai." };
    }

    const { data: staff } = await supabase.from("staff").select("full_name").eq("id", staffId).maybeSingle();
    if (!staff) {
      return { error: "Can bo khong ton tai." };
    }

    const now = new Date();
    const meetingTime = new Date(`${meeting.meeting_date}T${meeting.meeting_time}`);
    const status = now > meetingTime ? "late" : "present";

    const { data: attendance, error } = await supabase
      .from("attendance")
      .insert({
        meeting_id: meetingId,
        staff_id: staffId,
        checkin_method: checkinMethod,
        checkin_time: now.toISOString(),
        status,
      })
      .select()
      .single();

    if (error || !attendance) {
      return { error: error?.message || "Khong the diem danh." };
    }

    return {
      data: {
        id: attendance.id,
        full_name: staff.full_name,
        status,
      },
    };
  };

  app.post("/api/attendance/checkin", async (req, res) => {
    const result = await createAttendance(Number(req.body.meeting_id), Number(req.body.staff_id), req.body.checkin_method || "qr");
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    return res.json(result.data);
  });

  app.get("/api/meetings/:id/qr-token", requireAuth, async (req, res) => {
    const token = jwt.sign({ meetingId: Number(req.params.id), type: "qr_checkin" }, JWT_SECRET, { expiresIn: "15s" });
    const interfaces = os.networkInterfaces();
    let localIp = "localhost";

    for (const name of Object.keys(interfaces)) {
      for (const item of interfaces[name] || []) {
        if (item.family === "IPv4" && !item.internal) {
          localIp = item.address;
          break;
        }
      }
      if (localIp !== "localhost") {
        break;
      }
    }

    return res.json({ token, localIp });
  });

  app.post("/api/attendance/self-checkin", async (req, res) => {
    const { meeting_id, staff_id, qr_token } = req.body;

    if (!qr_token) {
      return res.status(400).json({ error: "Ma QR khong hop le." });
    }

    try {
      const decoded = jwt.verify(qr_token, JWT_SECRET) as { meetingId: number; type: string };
      if (decoded.type !== "qr_checkin" || decoded.meetingId !== Number(meeting_id)) {
        return res.status(400).json({ error: "Ma QR khong dung cuoc hop." });
      }
    } catch {
      return res.status(400).json({ error: "Ma QR da het han. Vui long quet lai ma moi." });
    }

    const result = await createAttendance(Number(meeting_id), Number(staff_id), "self");
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    return res.json({ success: true, ...result.data });
  });

  app.get("/api/stats", async (_req, res) => {
    const [
      { count: totalStaff },
      { count: totalDepartments },
      { count: totalMeetings },
      { count: totalPositions },
      { count: totalNeighborhoods },
      { data: lastMeeting },
    ] = await Promise.all([
      supabase.from("staff").select("*", { count: "exact", head: true }),
      supabase.from("departments").select("*", { count: "exact", head: true }),
      supabase.from("meetings").select("*", { count: "exact", head: true }),
      supabase.from("positions").select("*", { count: "exact", head: true }),
      supabase.from("neighborhoods").select("*", { count: "exact", head: true }),
      supabase.from("meetings").select("*").order("meeting_date", { ascending: false }).limit(1).maybeSingle(),
    ]);

    let lastMeetingStats = { present: 0, late: 0, absent: totalStaff || 0 };

    if (lastMeeting) {
      const { data: attendance } = await supabase.from("attendance").select("status").eq("meeting_id", lastMeeting.id);
      const present = attendance?.filter((item) => item.status === "present").length || 0;
      const late = attendance?.filter((item) => item.status === "late").length || 0;
      lastMeetingStats = {
        present,
        late,
        absent: Math.max((totalStaff || 0) - present - late, 0),
      };
    }

    return res.json({
      totalStaff: totalStaff || 0,
      totalDepartments: totalDepartments || 0,
      totalMeetings: totalMeetings || 0,
      totalPositions: totalPositions || 0,
      totalNeighborhoods: totalNeighborhoods || 0,
      lastMeetingTitle: lastMeeting?.title || "Chua co cuoc hop",
      lastMeetingStats,
    });
  });

  app.get("/api/stats/departments", async (_req, res) => {
    const { data: lastMeeting } = await supabase.from("meetings").select("*").order("meeting_date", { ascending: false }).limit(1).maybeSingle();
    if (!lastMeeting) {
      return res.json([]);
    }

    const [{ data: attendance }, { data: staffList }] = await Promise.all([
      supabase.from("attendance").select("staff_id, status").eq("meeting_id", lastMeeting.id),
      supabase.from("staff").select("id, departments(name), neighborhoods(name), positions(name)"),
    ]);

    const rows: Record<string, { present: number; late: number; absent: number }> = {};

    for (const staff of staffList || []) {
      const departmentName = Array.isArray((staff as any).departments) ? (staff as any).departments[0]?.name : (staff as any).departments?.name;
      const neighborhoodName = Array.isArray((staff as any).neighborhoods) ? (staff as any).neighborhoods[0]?.name : (staff as any).neighborhoods?.name;
      const key = departmentName || neighborhoodName || "Khac";
      if (!rows[key]) {
        rows[key] = { present: 0, late: 0, absent: 0 };
      }

      const found = (attendance || []).find((item) => item.staff_id === staff.id);
      if (!found) {
        rows[key].absent += 1;
      } else if (found.status === "late") {
        rows[key].late += 1;
      } else {
        rows[key].present += 1;
      }
    }

    return res.json(
      Object.entries(rows)
        .map(([name, value]) => ({ name, ...value, total: value.present + value.late + value.absent }))
        .sort((a, b) => b.total - a.total),
    );
  });

  app.get("/api/stats/trend", async (_req, res) => {
    const { data: meetings } = await supabase
      .from("meetings")
      .select("id, title, meeting_date")
      .order("meeting_date", { ascending: false })
      .limit(5);

    if (!meetings?.length) {
      return res.json([]);
    }

    const { count: totalStaff } = await supabase.from("staff").select("*", { count: "exact", head: true });
    const orderedMeetings = [...meetings].reverse();
    const result = [];

    for (const meeting of orderedMeetings) {
      const { data: attendance } = await supabase.from("attendance").select("status").eq("meeting_id", meeting.id);
      const present = attendance?.filter((item) => item.status === "present").length || 0;
      const late = attendance?.filter((item) => item.status === "late").length || 0;

      result.push({
        meeting: meeting.title.length > 18 ? `${meeting.title.slice(0, 18)}...` : meeting.title,
        date: new Date(meeting.meeting_date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        present,
        late,
        absent: Math.max((totalStaff || 0) - present - late, 0),
      });
    }

    return res.json(result);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
