const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db"); // Database connection

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { full_name, email, phone_number, password } = req.body;
        console.log("✅ Signup request received for:", email);

        if (!full_name || !email || !phone_number || !password) {
            console.log("❌ Missing required fields:", req.body);
            return res.status(400).json({ error: "All fields are required" });
        }

        const [existingUser] = await db.execute("SELECT * FROM Customers WHERE LOWER(email) = LOWER(?)", [email]);

        if (existingUser.length > 0) {
            console.log("❌ Email already in use:", email);
            return res.status(400).json({ error: "Email is already in use" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            "INSERT INTO Customers (full_name, email, phone_number, password_hash) VALUES (?, ?, ?, ?)",
            [full_name, email, phone_number, password_hash]
        );

        console.log("✅ User created successfully with customer_id:", result.insertId);

        res.status(201).json({
            message: "Signup successful",
            user: { customer_id: result.insertId, full_name, email, phone_number }
        });

    } catch (error) {
        console.error("❌ Error during signup:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

module.exports = router;
