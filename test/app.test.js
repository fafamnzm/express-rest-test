const request = require("supertest")
const app = require("../src/app")
const mongoose = require("mongoose")
const db = mongoose.connection
require("dotenv").config()

// making the token global for all the tests
let token

before(function (done) {
  // Connecting to the Database
  mongoose
    .connect(
      process.env.DB_CONNECT,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("connected to DB!")
    )
    .then(() => {
      // Clearing the Database so we do nnot hit the repetitive problem for uniquue entities
      // Using in the then, to wait for db to connect
      db.dropDatabase()
      done()
    })
  // Clearing the Database so we do nnot hit the repetitive problem for uniquue entities
  // db.dropCollection("users")
  // db.dropDatabase()
  // done()
})

// Dissconnecting the Database
after(function () {
  mongoose.disconnect()
})

// Just in case we needed something to happen befoore and after each test

// beforeEach(function () {
//   console.log("Before Each")
// })

// afterEach(function () {
//   console.log("After Each")
// })

// Testing the Hello world endpoint
describe("GET /", function () {
  it("get users in json", function (done) {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        else done()
      })
  })
})

// Register a new user and assigning the JWT token as it is returned here
describe("POST /register", function () {
  it("Registers a new user and assigns the token in Bearer format", function (done) {
    request(app)
      .post("/register")
      .send({ email: "test@test.com", password: "123456" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        // console.log({ register: res.body })
        token = "Bearer " + res.body.token
        if (err) return done(err)
        done()
      })
  })
})

// Post a sample post to the posts!! :D
describe("POST /posts", function () {
  it("Posts a sample post", function (done) {
    request(app)
      .post("/post")
      .send({ title: "post test 1", content: "content post test 1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body)
        if (err) return done(err)
        done()
      })
  })
})

// Get all the posts previously added
describe("GET /posts", function () {
  it("Gets posts in json format", function (done) {
    request(app)
      .get("/posts")
      .expect(200)
      .end((err, res) => {
        // console.log(res.body)
        if (err) done(err)
        else done()
      })
  })
})

// Get all the users. This endpoint requires auth
describe("GET /users", function () {
  // Using login endpoint to login the user
  // If we want to do this for each endpoint individually

  // let token
  // before(function (done) {
  //   request(app)
  //     .post("/login")
  //     .send({ email: "test@test.com", password: "123456" })
  //     .end(function (err, res) {
  //       console.log(res.body)
  //       token = 'Bearer '+ res.body.token // Or something
  //       done()
  //     })
  // })

  it("Gets users in json format with jwt auth", function (done) {
    request(app)
      .get("/users")
      .set("Authorization", token)
      .expect(200)
      .end((err, res) => {
        // console.log(res.body)
        if (err) done(err)
        else done()
      })
  })
})
