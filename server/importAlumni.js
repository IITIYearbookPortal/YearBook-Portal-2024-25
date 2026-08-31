require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");

const AlumniData = require("./models/alumniData");

const alumniData = JSON.parse(fs.readFileSync("./alumniData.json", "utf-8"));

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_LINK);

    console.log("MongoDB connected");

    const documents = alumniData.map((email) => ({
      email: email.trim().toLowerCase(),
    }));

    await AlumniData.deleteMany({});

    await AlumniData.insertMany(documents);

    console.log(`Successfully imported ${documents.length} alumni emails`);

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Import failed:", error);

    process.exit(1);
  }
}
importData();
