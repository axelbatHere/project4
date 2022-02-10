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
    .query("SELECT * FROM testing")
    .then((data) => {
      return res.json(data.rows).status(200);
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
      pool.query('INSERT INTO testing (previous_user, username, password, score, host) VALUES($1, $2, $3, $4, $5)', [0, username, password, 0, 0], (error, results) => {
        if (error) {
          res.send(error.message).status(500);
        } else {

          res.status(200);
        }
      });
    }
  });
});

let usernama="";
let password="";

//GET REQUEST FOR LOGIN PLAYER
// check if empty values user/pass
app.get("/login/:username", (req, res) => {
  const {username} = req.params;
  if (usernama == "") {
  usernama = username.substring(1);
  return res.status(200);
  } else {
    password = username.substring(1);
  }
  pool.query("SELECT * FROM testing WHERE username = $1 AND password = $2", [usernama, password]).then(data => {
    if (data.rowCount < 1) {
      let nonexistentError = new Error("Username and password do not exist");
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
usernama = "";
password = "";
});

//on correct guess
app.put("/updateScore", (req, res) => {
  // login user, store the user (user) data localstorage
  // fetch local storage and the username from it
  //BACKEND
  const { username, score } = req.body;

  pool
    .query("UPDATE testing SET score = $2 WHERE username = $1", [
      username,
      score,
    ])
    .then((data) => {
      return res.status(200).json({});
    });
});

app.put('/updateHost', (req, res) => {
    const{username, host} = req.body;
    pool.query("UPDATE testing SET host = $1 WHERE username = $2", [host, username]).then(data => {
      return res.status(200).json({});
    })
});

app.put('/changePrevious', (req, res)=> {
  const {username} = req.body;
  pool.query("UPDATE testing SET previous_user = $1 WHERE username = $2", [0, username]).then(response => {
    return res.status(200).json({});
  })
})

app.put('/updatePrevious', (req, res) => {
  const {username} = req.body;
  pool.query("UPDATE testing SET previous_user = $1 WHERE username = $2", [1, username]).then(data => {
    return res.status(200).json({});
  })
})

app.get('/previous', (req, res) => {
  pool.query('SELECT * FROM testing WHERE previous_user = 1').then(response => {
    return res.json(response.rows).status(200);
  }).catch(error => {
    console.log('error has occured' + error.message);
  })
})

app.get('/theHost', (req, res) => {
  pool.query('SELECT * FROM testing WHERE host = 1').then(response => {
    return res.json(response.rows).status(200);
  }).catch(error => {
    console.log('error has occured' + error.message);
  })
})

app.listen(port, hostname, () => {
  console.log(`server is running at ${hostname}:${port}`);
});
