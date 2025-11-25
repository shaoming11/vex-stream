const express = require('express')
const { open } = require('sqlite');
const sqlite3 = require("sqlite3");
const path = require("path");

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
                notes TEXT NOT NULL,
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
    console.log(response)
    const data = await response.json()
    console.log("helloooo")
    res.send("gurt")
})

router.post("/create", async (req, res) => {
    try {
        const { note } = req.body;

        const insertNoteQuery = `INSERT INTO notes (note) VALUES (?)`;
        const result = await db.run(insertNoteQuery, [note]);
    } catch (e) {
        console.log(e);
    }
    res.send("Create new note")
})

router
    .route("/:id")
    .get(
    (req, res) => {
        res.send(`Create new user with ID ${req.params.id}`)
    })
    .put(
    (req, res) => {
        res.send(`Update user with ID ${req.params.id}`)
    })
    .delete(
    (req, res) => {
        res.send(`Delete user with ID ${req.params.id}`)
    })

module.exports = router