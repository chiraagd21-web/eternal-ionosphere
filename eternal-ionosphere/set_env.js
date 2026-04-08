const { execSync } = require('child_process');

try {
  console.log('Adding URL...');
  execSync('npx vercel env add NEXT_PUBLIC_SUPABASE_URL production', {
    input: 'https://zacvdbewudnmgwxvhyff.supabase.co\n',
    stdio: ['pipe', 'inherit', 'inherit']
  });
  console.log('Adding Key...');
  execSync('npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production', {
    input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphY3ZkYmV3dWRubWd3eHZoeWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2Njg1MDEsImV4cCI6MjA5MTI0NDUwMX0.j03sj4F6qcAJQabS_cj3Ro-ev8a3TVIEFfzJ3M9QM0k\n',
    stdio: ['pipe', 'inherit', 'inherit']
  });
  console.log('Done!');
} catch (e) {
  console.error('Failed', e.message);
}
