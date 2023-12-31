const express = require("express");

const app = express();
const bcrypt = require("bcrypt-nodejs");
const corse = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "dpg-clm5hs9fb9qs7397tae0-a",
    port: 5432,
    user: "behnam",
    password: "heIO72dHPGiFUCBfI7uAyj5TJF4nH8xw",
    database: "smart_brain_vygr",
  },
});

app.use(express.json());
app.use(corse());

app.get("/", (req, res) => {
  // res.send(database.users);
});

app.post("/signin", signin.handleSignIn(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  register.handleRegister(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageUrl", (req, res) => {
  image.handleAPICall(req, res);
});

// const PORT = process.env;
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
