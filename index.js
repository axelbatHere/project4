const express = require("express");
const cors = require("cors");
const pool = require("./sample");
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
  const { username } = req.params;
  pool
    .query("SELECT * FROM players WHERE player_id = $1", [username])
    .then((data) => {
      return res.send(data.rows).status(200);
    })
    .catch((err) => {
      return res.send(err.message).status(500);
    });
});

//POST DATA FOR NEW USERS

app.post("/signup", (req, res) => {
  const {username, password} = req.body;
  pool.query('SELECT * FROM testing WHERE username=$1', [username]).then(data => {
    if (data.rows.length > 0) {
      let duplicateError = new Error(`Username ${username} already exists`);
      return res.status(400).json( {
        errorCode: 'user exists',
        errorMsg: duplicateError.message
      });
    } else {
      pool.query('INSERT INTO testing (username, password, score) VALUES($1, $2, $3)', [username, password, 0], (error, results) => {
        if (error) {
          res.send(error.message).status(500);
        } else {
          res.status(200);
        }
      });
    }
  });
});

//POST REQUEST FOR LOGIN PLAYER
// check if empty values user/pass
app.get("/login/:username", (req, res) => {
  const { username, password} = req.params;
  const user = username.substring(1);
  console.log(user);
  pool
      .query("SELECT * FROM testing WHERE username = $1", [user])
      .then((data) => {
        if (data.rowCount < 1) {
          pool.query("SELECT * FROM testing WHERE password = $1", [user]).then(data => {
            if (data.rowCount < 1) {
              let nonexistentError = new Error("Username does not exist");
              return res.status(400).json({
              errorCode: "No User found",
              errorMsg: nonexistentError.message,
            });
            } else {
              return res.status(200).json({
                authorized: true,
                authMsg: "User has been authenticated",
                user: data.rows[0],
              });
            }
          });
          
      } else {
        return res.status(200).json({
          authorized: true,
          authMsg: "User has been authenticated",
          user: data.rows[0],
        });
      }
      });
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
