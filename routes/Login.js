const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Ensure db.js uses MySQL2 promise-based pool
const router = express.Router();
require("dotenv").config(); // Load environment variables

// Secret key for JWT (Set this in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("✅ Login request received for:", email);

        // Check if all required fields are provided
        if (!email || !password) {
            console.log("❌ Missing email or password");
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Retrieve user details from the database
        const [user] = await db.execute("SELECT * FROM Customers WHERE LOWER(email) = LOWER(?)", [email]);

        // If user does not exist
        if (user.length === 0) {
            console.log("❌ User not found:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const { customer_id, full_name, password_hash, phone_number } = user[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, password_hash);
        if (!isPasswordValid) {
            console.log("❌ Invalid password attempt for:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ Login successful for:", email);

        // Generate JWT token
        const token = jwt.sign(
            { customer_id, email },
            JWT_SECRET,
            { expiresIn: "2h" } // Token expires in 2 hours
        );

        // Return success response with token
        res.status(200).json({
            message: "Login successful",
            user: {
                customer_id,
                full_name,
                email,
                phone_number
            },
            token
        });

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

module.exports = router;
