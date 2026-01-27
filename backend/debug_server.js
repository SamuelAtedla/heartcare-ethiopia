const fs = require('fs');
const { spawn } = require('child_process');

const out = fs.openSync('./debug_output.txt', 'a');
const err = fs.openSync('./debug_output.txt', 'a');

const p = spawn('node', ['server.js'], {
    stdio: ['ignore', out, err]
});

p.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
