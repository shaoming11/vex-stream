const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("user list")
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