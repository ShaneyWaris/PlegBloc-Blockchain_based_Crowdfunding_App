require("dotenv").config();
const mongoose = require("mongoose");
// Database URL
const DB = process.env.mongodbURL.toString('utf-8');

// connect with your database.
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// db is your database reference, which acquire the connection.
const db = mongoose.connection;

// Check if there is an error while connecting to the database.
db.on("error", console.error.bind(console, "Error in connecting to MongoDB"));

// If there is no error.
db.once("open", () => {
  console.log("Connected to Database: MongoDB");
});

module.exports = db;