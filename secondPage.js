
<script src="frontend.js">let usernama = usernam;</script>

async function getData() {
    const response = await fetch('http://localhost:3000/players/:1');
    const data = await response.json();
    console.log(data);
}

document.querySelector('#logout').onclick = function (){
console.log(usernam);
}