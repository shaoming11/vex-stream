const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = 5001

const VEX_KEY = process.env.VEX_KEY

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.set("view engine", "ejs")

app.get('/', (req, res) => {
  res.render("index", {text: "robot"})
})

const { router: userRouter } = require('./routes/users')
const { router: authRouter } = require('./routes/auth')

app.use("/users", userRouter)
app.use("/auth", authRouter)

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`)
})