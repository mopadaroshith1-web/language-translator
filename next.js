let inputText = document.getElementById("inputText");

let translateBtn = document.getElementById("translateBtn");

let resultText = document.getElementById("resultText");


translateBtn.addEventListener("click", function () {

    let text = inputText.value;

    resultText.innerText = text;

});