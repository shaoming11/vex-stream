const express = require('express')

const router = express.Router()

const VEX_KEY = process.env.VEX_KEY

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

router.get("/new", (req, res) => {
    res.send("User New Form")
})

router.post("/create", (req, res) => {
    res.send("Create new user")
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