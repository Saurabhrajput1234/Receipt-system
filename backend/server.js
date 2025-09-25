const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { connectDB } = require("./config/database");
const Receipt = require("./models/Receipt");
const receiptRoutes = require("./routes/receipts");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["http://localhost:3000", "http://localhost:5173"] // Add your production domain here
        : [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
          ],
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/receipts", receiptRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running with Supabase",
    database: "Supabase",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to Supabase
    await connectDB();

    // Show table creation instructions
    await Receipt.createTable();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Using Supabase database`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📝 Receipts API: http://localhost:${PORT}/api/receipts`);
      console.log(
        `\n📋 Make sure to create the receipts table in your Supabase project!`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
