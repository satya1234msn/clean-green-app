const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CleanGreen App Development Environment...\n');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for backend to start
setTimeout(() => {
  console.log('\n📱 Starting frontend development server...');
  
  // Start frontend server
  const frontend = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });

  backend.on('close', (code) => {
    console.log(`Backend server exited with code ${code}`);
  });

  frontend.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
  });

}, 3000);

backend.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
});
