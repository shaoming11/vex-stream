const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5001

const VEX_KEY = process.env.VEX_KEY

app.use(cors())

app.set("view engine", "ejs")

app.get('/', (req, res) => {
  res.render("index", {text: "robot"})
})

const userRouter = require('./routes/users')

app.use("/users", userRouter)

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`)
})