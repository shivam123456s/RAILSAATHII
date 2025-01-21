const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

// Check if the config exists
if (!fs.existsSync(configPath)) {
  console.error("Error: Configuration file not found. Please run setup.js first.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const folderPath = config.folderPath;

// Use the folderPath in your application logic
console.log(`Starting the server with folder path: ${folderPath}`);
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
const PORT = 5000;  // Ensure this is the same as your frontend

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Enable CORS for cross-origin requests

const dataFile = "./buttons.json";  // Ensure this file exists and has the correct structure

// GET route to retrieve all buttons
app.get("/buttons", (req, res) => {
  try {
    const buttons = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    res.json(buttons);
  } catch (error) {
    res.status(500).json({ message: "Error reading buttons data" });
  }
});

// PUT route to update a button
app.put("/buttons/:id", (req, res) => {
  try {
    const buttons = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    const id = parseInt(req.params.id);
    const index = buttons.findIndex((b) => b.id === id);

    if (index !== -1) {
      buttons[index] = { ...buttons[index], ...req.body };
      fs.writeFileSync(dataFile, JSON.stringify(buttons, null, 2));
      res.json({ message: "Button updated successfully!" });
    } else {
      res.status(404).json({ message: "Button not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating button" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
