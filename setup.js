const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Prompt user for input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the Server Setup!");

rl.question('Please provide the location of your project folder: ', (folderPath) => {
  // Validate the folder path
  if (!fs.existsSync(folderPath)) {
    console.error("Error: The folder path doesn't exist.");
    rl.close();
    return;
  }

  // Save the folder location to a config file
  const config = { folderPath };
  fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(config, null, 2));
  console.log("Configuration saved!");

  // Automatically start the server
  console.log("Starting the server...");
  const { exec } = require('child_process');
  exec(`node ${path.join(folderPath, 'server.js')}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Error starting the server:", err.message);
    }
    console.log(stdout || stderr);
  });

  rl.close();
});
