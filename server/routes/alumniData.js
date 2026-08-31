// routes/alumni.js
const express = require("express");
const Alumni = require("../models/alumniData.js");

const router = express.Router();

router.get("/getAlumniData", async (req, res) => {
  try {
    const alumni = await Alumni.find({}, { _id: 0, email: 1 });
    res.json(alumni.map((item) => item.email));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch alumni data" });
  }
});

module.exports = router;
