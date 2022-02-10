

async function getDatau1() {
    const response = await fetch('http://localhost:3000/previous');
    const data = await response.json();
    return data;
}

async function retrieveFromData1() {
    const response = await fetch('http://localhost:3000/theHost');
    const data = await response.json();
    return data;
  }

retrieveFromData1().then(response => {
    document.querySelector('#theUser').textContent = "User's Name: " + response[0].username;
    document.querySelector('#theScore').textContent = "Highest Score: " + response[0].score;
});

getDatau1().then(response => {
    document.querySelector('#otherUser').textContent = "Previous User's Name: " + response[0].username;
    document.querySelector('#otherScore').textContent = "Previous User's Highest Score: " + response[0].score;
}).catch(error => {
    document.querySelector('#otherUser').textContent = "Previous User's Name: No User has been found.";
    document.querySelector('#otherScore').textContent = "Previous User's Highest Score: None detected"; 
});