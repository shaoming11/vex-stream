const express = require('express')
const { open } = require('sqlite');
const sqlite3 = require("sqlite3");
const path = require("path");
const { authenticateToken } = require('./auth');

const VEX_KEY = process.env.VEX_KEY

const dbPath = path.join(__dirname, "../vexData.db");
let db;

const connectDb = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        await db.exec(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT NOT NULL,
                team TEXT NOT NULL,
                note TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        )
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

connectDb()

const router = express.Router()

router.get("/", (req, res) => {
    res.send("user list")
})

router.get("/search", async (req, res) => {
    const response = await fetch('https://www.robotevents.com/api/v2/teams/', {
        headers: {
            'Authorization': `Bearer ${VEX_KEY}`,
            'Content-Type': 'application/json'
        }
    })
    console.log("helloooo")
    console.log(response)
    const data = await response.json()
    console.log("helloooo")
    res.send("gurt")
})

router.post("/create", authenticateToken, async (req, res) => {
    try {
        const { note, team } = req.body;
        const user = req.user.id;

        if (!note || !team) {
            return res.status(400).json({ error: "Note and team are required" });
        }
        const insertNoteQuery = `INSERT INTO notes (user, team, note) VALUES (?, ?, ?)`;
        const result = await db.run(insertNoteQuery, [user, team, note]);

        res.status(201).json({
            message: "Note created successfully",
            noteId: result.lastID
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to create note" });
    }
})

router.get("/load", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const loadUserQuery = `SELECT * FROM notes WHERE user = ? ORDER BY created_at DESC`;
        const notes = await db.all(loadUserQuery, [userId]);

        res.json(notes);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to load notes" });
    }
})

// router
//     .route("/:id")
//     .get(
//     (req, res) => {
//         res.send(`Create new user with ID ${req.params.id}`)
//     })
//     .put(
//     (req, res) => {
//         res.send(`Update user with ID ${req.params.id}`)
//     })
//     .delete(
//     (req, res) => {
//         res.send(`Delete user with ID ${req.params.id}`)
//     })

module.exports = {router};