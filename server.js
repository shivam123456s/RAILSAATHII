// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

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
