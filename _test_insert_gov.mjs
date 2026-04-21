import { createClient } from '@supabase/supabase-js';
const s = createClient('https://dtymdwlfozxrrrzohvnp.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eW1kd2xmb3p4cnJyem9odm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTg4NjEsImV4cCI6MjA4OTQ3NDg2MX0.y3-o8wG9rDBYNuPa3c7BxcZKxU3xeZAvprulZ9NL0fc');

const { error: authErr } = await s.auth.signInWithPassword({ email: 'nghiemquynh0210@gmail.com', password: '123123' });
if (authErr) { console.error('Auth err:', authErr); process.exit(1); }

console.log('Testing insert government department...');
const { error: err1 } = await s.from('departments').insert({ name: 'TEST GOV', org_type: 'government' });
if (err1) { console.log('ERROR:', err1); } else { console.log('OK GOV'); }

console.log('Testing insert school department...');
const { error: err2 } = await s.from('departments').insert({ name: 'TEST SCHOOL', org_type: 'school' });
if (err2) { console.log('ERROR:', err2); } else { console.log('OK SCHOOL'); }

process.exit(0);
