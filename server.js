const express = require("express");
const db = require("./database.js");
const shortid = require("shortid");

const server = express();

// ALLOWS FOR POST REQUESTS TO HAPPEN, OTHERWISE GET 500 ERROR

server.use(express.json());

// GET REQUESTS
server.get("/users", (req, res) => {
  const users = db.getUsers();
  res.json(users);
});

// json comes back as string, needed to parse into an integer to match database id type
server.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const user = db.getUserById(parseInt(userId));
    if (user) {
        res.json(user)
    }
    else {
        res.status(404).json({ message: "user not found"})
    }

// res.json(req.params.id)

});

// POST REQUESTS

// works
server.post("/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res.status(400).json({
      message: "Missing name and/or bio",
    });
  } else {
    const newUser = db.createUser({
      id: req.body.id,
      name: req.body.name,
      bio: req.body.bio,
    });

    res.json(newUser);
  }
});


//DELETE REQUESTS 


server.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const deleted = db.deleteUser(parseInt(userId));
  if (!deleted) {
    res.json({ message: "user deleted"});
  } else {
    res.status(404).json({ message: "error 404" });
  }
});

// PATCH REQUESTS

server.patch("/users/:id", (req, res) => {
  const user = db.getUserById(parseInt(req.params.id));
  const data =  { 
    id: parseInt(req.params.id),
    name: req.body.name || user.name,
    bio: req.body.bio,
  }
  if (user) {
  const updatedUser = db.updateUser(parseInt(req.params.id), data);
  res.json(updatedUser);
}
    else {
        res.status(400).json({ message: "error"}) 
    }
});

server.listen(9090, () => {
  console.log("server started at port 9090");
});
