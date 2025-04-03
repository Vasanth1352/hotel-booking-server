const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const loginRouter = require("./routes/Login");   // Ensure correct path
const signupRouter = require("./routes/Signup"); // Ensure correct path
const authenticateToken = require("./middleware/auth");
const pool = require("./db"); // Database connection

dotenv.config(); // Load environment variables

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS

// Use authentication routes
app.use("/login", loginRouter);
app.use("/signup", signupRouter);

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
    res.json({
        message: "This is a protected route",
        user: req.user // The user info comes from the decoded token
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        await pool.getConnection(); // Test database connection
        console.log(`✅ Server running on port ${PORT}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
});
