// function fetchData() {
//   fetch("http://localhost:3000/players")
//     .then((response) => {
//       if (!response.ok) {
//         throw Error("ERROR");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data[0].username);
//       document.getElementById(
//         "userName"
//       ).innerHTML = `UserName is ${data[0].username}`;
//       document.getElementById(
//         "userScore"
//       ).innerHTML = `Score is ${data[0].score}`;

//       //   console.log(data[0]);
//       //   const [password, player_id, score, username] = data[0];
//       //   console.log(username);

//       //     .map((user) => {
//       //       return `<p> username: ${user.username}</p>`;
//       //     })
//       //     .join("");
//       //   document.querySelector("#app").innerHTML = showData;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }
// fetchData();
// // let username = "hawk23";
// // let password = "hawk124";

// // const data = { username: `${username}`, password: `${password}` };

// function signup() {
//   fetch("http://localhost:3000/signup", {
//     method: "POST", // or 'PUT'
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: "usernametest",
//       password: "12345",
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Success:", data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }
// signup();

// function login(data) {
//   fetch("http://localhost:3000/login", {
//     method: "POST", // or 'PUT'
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Success:", data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// // login(data);

// let number = 14;
// let specificUrl = `http://localhost:3000/players/${number}`;

// let getRequest = async () => {
//   try {
//     let fetched = await fetch(`http://localhost:3000/players/${number}`);
//     if (fetched) {
//       let read = await fetched.json();
//       console.log(read);
//       return read;
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// getRequest();

// // let scorr = 9;
// // let username = "joyboy123";

// // const score = { username: `${username}`, score: `${scorr}` };

// function changeScore() {
//   fetch("http://localhost:3000/updateScore", {
//     method: "PUT", // or 'PUT'
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: "hawk23",
//       score: 10,
//     }),
//   }).then((response) => response.json());
// }

// changeScore();
