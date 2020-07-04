//server.js
const mongoose = require("mongoose")
require("dotenv").config()

const app = require("./src/app")

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to DB!")
)

app.listen(3000, () => {
  console.log("Server is running on 3000")
})
