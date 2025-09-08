const express = require('express')

const app = express()
const PORT = 5000

app.get('/api/users', (req, res) => {
  res.send("Hello world")
})

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`)
})