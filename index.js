const http = require("http");
const express = require("express");
const cors = require("cors");
const pool = require("./sample");
const bcrypt = require("bcrypt");
const { query } = require("express");
const app = express();

app.use(express.json());
app.use(cors());

const hostname = "localhost";
const port = 3000;

//sql connection

//GET DATA

app.get("/players", (req, res) => {
  pool
    .query("SELECT * FROM players")
    .then((data) => {
      return res.send(data.rows).status(200);
    })
    .catch((err) => {
      return res.send(err.message).status(500);
    });
});

// GET DATA FILTERED

app.get("/players/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM players WHERE player_id = $1", [id])
    .then((data) => {
      return res.send(data.rows).status(200);
    })
    .catch((err) => {
      return res.send(err.message).status(500);
    });
});

//POST DATA FOR NEW USERS

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    let inputError = new Error("Invalid inputs provided for username/password");
    return res
      .status(400)
      .json({ errorCode: "invalid inputs", errorMsg: inputError.message });
  } else {
    pool
      .query("SELECT * FROM players WHERE username=$1", [username])
      .then((data) => {
        if (data.rows.length > 0) {
          let duplicateError = new Error(`Username ${username} already exists`);
          return res.status(400).json({
            errorCode: "user exists",
            errorMsg: duplicateError.message,
          });
        } else {
          bcrypt.hash(password, 5, (err, hash) => {
            if (err) {
              return res.send(err).status(500);
            } else {
              pool
                .query(
                  "INSERT INTO players(username, password, score) VALUES($1,$2,$3) RETURNING *",
                  [username, hash, 0]
                )
                .then((newPlayer) => {
                  return res.send(newPlayer.rows).status(200);
                })
                .catch((err) => {
                  return res.send(err.message).status(500);
                });
            }
          });
        }
      });
  }
});

//POST REQUEST FOR LOGIN PLAYER
// check if empty values user/pass
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    let inputError = new Error("Invalid inputs for username/password");
    return res
      .status(400)
      .json({ errorCode: "Invalid Inputs", errorMsg: inputError.message });
  } else {
    pool
      .query("SELECT * FROM players WHERE username = $1", [username])
      .then((data) => {
        if (data.rowCount < 1) {
          let nonexistentError = new Error("Username does not exist");
          return res.status(400).json({
            errorCode: "No User found",
            errorMsg: nonexistentError.message,
          });
        } else {
          bcrypt.compare(password, data.rows[0].password, (err, result) => {
            if (err) {
              return res.send("Whoops...Error occurred").status(500);
            } else {
              if (result) {
                return res.status(200).json({
                  authorized: true,
                  authMsg: "User has been authenticated",
                  user: data.rows[0],
                });
              } else {
                return res.status(400).json({
                  errorCode: "Invalid Password",
                  errorMsg: "The provided password was wrong",
                });
              }
            }
          });
        }
      });
  }
});

//on correct guess
app.put("/updateScore", (req, res) => {
  // login user, store the user (user) data localstorage
  // fetch local storage and the username from it
  //BACKEND
  const { username, score } = req.body;

  pool
    .query("UPDATE players SET score = $2 WHERE username = $1", [
      username,
      score,
    ])
    .then((data) => {
      return res.status(200).json({});
    });
});

app.listen(port, hostname, () => {
  console.log(`server is running at ${hostname}:${port}`);
});
