//app.js
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()

const auth = require("../middlewares/auth")

const User = require("../models/User")
const Post = require("../models/post")

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).send({ Hello: "World!" })
})

app.get("/posts", async (req, res) => {
  const posts = await Post.find()
  res.status(200).json({ posts })
})

app.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find()
    if (!req.isAuth) res.status(403).json({ msg: "Unauthorized Access!" })
    else res.status(200).json(users)
    // res.status(200).json(users)
  } catch (err) {
    throw err
  }
})

app.post("/post", async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
    })
    await post.save()
    res.json(post)
  } catch (err) {
    throw err
  }
})

app.post("/register", async (req, res) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email })
    if (checkUser) res.status(400).json({ info: "User already exists" })
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    })
    await user.save()
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_SECRET
    )
    res.status(200).json({ info: "Successfully Registered", token })
  } catch (err) {
    console.log(err)
    res.status(500)
    throw err
  }
})

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email })
    console.log(user)
    if (!user) throw new Error("User not found")
    const checkPass = bcrypt.compare(req.body.password, user.password)
    if (!checkPass) throw new Error("Wrong Password!")
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_SECRET
    )
    res.json({ info: "successfully Logged in", token })
  } catch (err) {
    throw err
  }
})

module.exports = app
