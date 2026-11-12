const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const assessmentRoutes = require("./routes/assessment");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 4 * 1024 * 1024 }, // 4MB file cap leaves room for multipart fields within Vercel’s 4.5MB request limit.
    abortOnLimit: true,
    responseOnLimit: "File size limit exceeded (4MB max)",
  }),
);

// Routes
app.use("/api/assessment", assessmentRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "AI PrepPulse API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`PrepPulse API listening on ${PORT}`));
}
module.exports = app;
