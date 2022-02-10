//SIGNUP FETCH
async function signup() {
  console.log("function is executing");
  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
      'Content-TYPE': 'application/json'
    },
    body: JSON.stringify( {
      username: `${usernam}`, 
      password: `${passwor}`
    })
  });
}


async function getDatau() {
  const response = await fetch('http://localhost:3000/players');
  const data = await response.json();
  return data;
}


async function logIn(value) {
  const response = await fetch(`http://localhost:3000/login/:${value}`);
  const data = await response.json();
  highScore = data.user.score;
  document.querySelector(
    ".highScore"
  ).textContent = `Highscore: ${highScore}`;
}

// LOGIN
function signUp() {
  document.querySelector(".buffer").style.visibility = "visible";
  document.querySelector("#login").textContent = "Sign Up";
  signing = 1;
  //Can now properly switch forms when pressing between log in and sign in.
}
function login() {
  document.querySelector(".buffer").style.visibility = "visible";
  document.querySelector("#login").textContent = "Log In"; //With this, the names switch properly now.
  signing = 2;
}

function logOut() {
  document.querySelector('#profilePic').style.display = "none";
  document.querySelector('#signInButton').style.visibility = "visible";
  document.querySelector('#thelogInT').style.visibility = "visible";
  reset();
  document.querySelector(
    ".highScore"
  ).textContent = `Highscore: ` + 0;
}

function modalClose() {
  document.querySelector(".buffer").style.visibility = "hidden";
}

function resetScore() {
  document.querySelector(".score").textContent = "Score: 10";
  history.innerHTML = "";
  document.querySelector(".correction").textContent = `Guess a Number!`;
}

let usernam = "";
let passwor = "";
let signing = 0;



document.querySelector("#submitBut").onclick = function () {
  usernam = document.querySelector("#userName").value;
  passwor = document.querySelector("#passwordInput").value;
  if (signing == 1) {
    signup().catch(error => {
    console.log('error');
  });
  usernam = "";
  passwor = "";
  document.querySelector('#signInButton').style.visibility = "hidden";
  } else if (signing == 2) {
    logIn(usernam).catch(error => {
      console.log('error');
    });
    logIn(passwor).catch(error => {
      console.log('error');
    });
    getDatau().then(response => {
      for (let i = 0; i < response.length; i++) {
        let options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: `${response[i].username}`
          })
        }
        fetch('http://localhost:3000/changePrevious', options);
      }
      for (let i = 0; i < response.length; i++) {
        let options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: `${response[i].username}`,
            host: 0
          })
        }
        if (response[i].username != usernam) {
        if (response[i].host == 1) {
          fetch('http://localhost:3000/updateHost', options);
            options = {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: `${response[i].username}`
              })
            }
            fetch('http://localhost:3000/updatePrevious', options);
        } else { 
        fetch('http://localhost:3000/updateHost', options);
        }
        } else {
          options = {
            method:'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: `${response[i].username}`,
              host: 1
            })
          }
          fetch('http://localhost:3000/updateHost', options);
        }
      }
    });
    document.querySelector('#profilePic').style.display = "block";
    document.querySelector('#signInButton').style.visibility = "hidden";
    document.querySelector('#thelogInT').style.visibility = "hidden";
  }
};

// GAME
let correctAnswer = Math.floor(Math.random() * 100) + 1;
console.log(`CORRECT ANSWER IS ${correctAnswer}`);

document.getElementById("win").style.visibility = "hidden";
document.getElementById("lose").style.visibility = "hidden";

let userAnswer = [];

// USER INPUT LOGIC:
function check(input) {
  if (input.length === 0 || isNaN(input)) {
    document.querySelector(".correction").textContent = "Not a number!";
    return false;
  }
  if (input > 100 || input < 1) {
    document.querySelector(".correction").textContent =
      "Type a number between 1 and 100!";
    return false;
  }
  for (let i = 0; i < userAnswer.length; i++)
    if (userAnswer[i] == input) {
      document.querySelector(".correction").textContent =
        "You have already chosen that number!";
      return false;
    }
  return true;
}

//GAME LOGIC:
let checkAnswer = (correctAnswer, userAnswer) => {
  if (userAnswer === correctAnswer) {
    document.querySelector(
      ".correction"
    ).textContent = `ANSWER IS CORRECT: ${userAnswer}`;
    return true;
  } else if (
    userAnswer >= correctAnswer - 5 &&
    userAnswer <= correctAnswer + 5 &&
    userAnswer !== correctAnswer
  ) {
    if (userAnswer > correctAnswer)
      document.querySelector(
        ".correction"
      ).textContent = `You are close! Go Up!`;
    if (userAnswer < correctAnswer)
      document.querySelector(
        ".correction"
      ).textContent = `You are close! Go Down!`;
    return false;
  } else if (
    userAnswer >= correctAnswer - 10 &&
    userAnswer <= correctAnswer + 10 &&
    userAnswer !== correctAnswer
  ) {
    document.querySelector(".correction").textContent = `You are warm!`;
    return false;
  } else if (
    userAnswer > correctAnswer + 10 ||
    (userAnswer < correctAnswer - 10 && userAnswer !== correctAnswer)
  ) {
    if (userAnswer > correctAnswer)
      document.querySelector(
        ".correction"
      ).textContent = `You are freezing cold! Go Up!`;
    if (userAnswer < correctAnswer)
      document.querySelector(
        ".correction"
      ).textContent = `You are freezzing cold! Go Down!`;
    return false;
  }
};

function addToHistory(input) {
  let li = document.createElement("li");
  li.innerHTML = input;
  history.appendChild(li);
}

let history = document.querySelector("ul");
let gameTries = 10;
let highScore = 0;

//RETURN TEXT LOGIC:
function returnText() {
  let input = document.getElementById("userInput").value;
  document.getElementById("userInput").value = "";
  if (!check(input)) return 0;
  input = Number(input);
  if (!checkAnswer(input, correctAnswer)) {
    gameTries--;
    checkAnswer(input, correctAnswer);
    console.log(`# of tries left ${gameTries}`);
    document.querySelector(".score").textContent = `Score: ${gameTries}`;
    addToHistory(input);
    if (gameTries === 0) {
      document.getElementById("mainGame").style.visibility = "hidden";
      document.getElementById("gameBar").style.visibility = "hidden";
      document.getElementById("lose").style.visibility = "visible";
      console.log("you lose!");
      document.querySelector(
        ".loseScore"
      ).textContent = `Your Score: ${gameTries}`;
      document.querySelector(
        ".loseBest"
      ).textContent = `Best Score: ${highScore}`;
    }
  } else {
    if (gameTries > highScore) {
      highScore = gameTries;
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: `${usernam}`,
          score: `${highScore}`
        })
      }
      fetch('http://localhost:3000/updateScore', options);
    }
    document.getElementById("win").style.visibility = "visible";
    document.getElementById("gameBar").style.visibility = "hidden";
    document.getElementById("mainGame").style.visibility = "hidden";
    checkAnswer(input, correctAnswer);
    document.querySelector(
      ".highScore"
    ).textContent = `Highscore: ${gameTries}`;
    document.querySelector(
      ".winScore"
    ).textContent = `Your Score: ${gameTries}`;
    document.querySelector(".winBest").textContent = `Best Score: ${highScore}`;
  }
  console.log(input);
  // document.getElementById("userInput").textContent = `Score: ${input - 1}`;
  userAnswer.push(input);
  console.log(userAnswer);
}

function reset() {
  if (gameTries == 0)
    document.getElementById("lose").style.visibility = "hidden";
  else document.getElementById("win").style.visibility = "hidden";
  document.getElementById("gameBar").style.visibility = "visible";
  document.getElementById("mainGame").style.visibility = "visible";
  document.querySelector(".correction").textContent = `Guess a Number!`;
  document.querySelector(".score").textContent = `Score: 10`;
  correctAnswer = Math.floor(Math.random() * 100) + 1;
  console.log(`correct answer:`, correctAnswer);
  history.innerHTML = "";
  gameTries = 10;
  userAnswer = [];
  usernam = "";
  passwor = "";
}
