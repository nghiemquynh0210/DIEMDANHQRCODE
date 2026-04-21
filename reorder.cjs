require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  await s.auth.signInWithPassword({ email: 'nghiemquynh0210@gmail.com', password: '123123' });
  const { data: positions } = await s.from('positions').select('*');
  
  for (const p of positions) {
    let order = 100;
             if (p.name === 'Bí thư Đảng ủy') order = 1;
    else if (p.name === 'Phó Bí thư Đảng ủy' || p.name === 'Phó bí thư Đảng ủy') order = 2;
    else if (p.name === 'Bí thư chi bộ') order = 3;
    else if (p.name.toLowerCase() === 'phó bí thư chi bộ') order = 4;
    else if (p.name === 'Bí thư') order = 5;
    else if (p.name.toLowerCase() === 'phó bí thư') order = 6;
    else if (p.name.toLowerCase() === 'chi ủy viên') order = 7;
    else if (p.name === 'Chủ tịch') order = 10;
    else if (p.name === 'Phó Chủ tịch') order = 11;
    else if (p.name === 'Trưởng khu phố') order = 14;
    else if (p.name === 'Phó Trưởng khu phố') order = 15;
    else if (p.name === 'Đảng viên') order = 90;
    
    await s.from('positions').update({ sort_order: order }).eq('id', p.id);
  }
  console.log('Reordered positions successfully!');
}
run();
