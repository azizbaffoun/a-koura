const { spawn } = require('child_process');
const path = require('path');

console.log('Starting development server...');

const reactScripts = spawn('npx', ['react-scripts', 'start'], {
  stdio: 'inherit',
  shell: true
});

reactScripts.on('error', (error) => {
  console.error('Failed to start development server:', error);
});

reactScripts.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
});
