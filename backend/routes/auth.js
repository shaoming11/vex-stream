const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const dbPath = path.join(__dirname, "../vexData.db");
let db;

const connectDb = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

connectDb();

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const checkUserQuery = `SELECT * FROM users WHERE username = ?`;
        const existingUser = await db.get(checkUserQuery, [username]);

        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
        const result = await db.run(insertUserQuery, [username, hashedPassword]);

        // Generate JWT token for the new user
        const token = jwt.sign(
            { userId: result.lastID, username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: result.lastID,
            username
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const getUserQuery = `SELECT * FROM users WHERE username = ?`;
        const user = await db.get(getUserQuery, [username]);

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            userId: user.id,
            username: user.username
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
});

// Verify token route
router.get('/verify', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({
            message: 'Token valid',
            userId: decoded.userId,
            username: decoded.username
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}); 

module.exports = router;