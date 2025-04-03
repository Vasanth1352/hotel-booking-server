const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Database connection
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Load JWT secret

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("✅ Login request received for:", email);

        if (!email || !password) {
            console.log("❌ Missing email or password");
            return res.status(400).json({ error: "Email and password are required" });
        }

        const [user] = await db.execute("SELECT * FROM Customers WHERE LOWER(email) = LOWER(?)", [email]);

        if (user.length === 0) {
            console.log("❌ User not found:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const { customer_id, full_name, password_hash, phone_number } = user[0];
        const isPasswordValid = await bcrypt.compare(password, password_hash);

        if (!isPasswordValid) {
            console.log("❌ Invalid password attempt for:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ Login successful for:", email);

        const token = jwt.sign({ customer_id, email }, JWT_SECRET, { expiresIn: "2h" });

        res.status(200).json({
            message: "Login successful",
            user: { customer_id, full_name, email, phone_number },
            token
        });

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

module.exports = router;
