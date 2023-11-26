const express = require("express");

const app = express();
const bcrypt = require("bcrypt-nodejs");
const corse = require("cors");

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
  database.users.push({
    id: "125",
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });

  if (!found) {
    res.status(400).json("Not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("Not found");
  }
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
