const express = require("express");

const app = express();
const bcrypt = require("bcrypt-nodejs");
const corse = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "test",
    database: "smart_brain",
  },
});

app.use(express.json());
app.use(corse());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      entries: 0,
      password: "cookies",
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      entries: 0,
      password: "apples",
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    "apples",
    "$2a$10$1ZwNjXGZslNsCLSdanZg2uj7wtV/xo6l/Zg6l75/9/W1EPHvuJHKO",
    function (err, res) {
      console.log("First", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$1ZwNjXGZslNsCLSdanZg2uj7wtV/xo6l/Zg6l75/9/W1EPHvuJHKO",
    function (err, res) {
      console.log("Second", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).send("Unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => res.status(400).json("Error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).send("Unable to get entries"));
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
