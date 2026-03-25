let container = document.getElementById("alumni-container");

if (container) {
    fetch("http://127.0.0.1:5000/alumni")
    .then(response => response.json())
    .then(data => {

        data.forEach(alumni => {
            let card = document.createElement("div");

            card.innerHTML = `
                <h3>${alumni[1]}</h3>
                <p><b>Company:</b> ${alumni[2]}</p>
                <p><b>Role:</b> ${alumni[3]}</p>
            `;

            container.appendChild(card);
        });
    });
}

// 🔍 SEARCH
let searchInput = document.getElementById("search");

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        let value = searchInput.value.toLowerCase();
        let cards = document.querySelectorAll("#alumni-container div");

        cards.forEach(card => {
            card.style.display =
                card.innerText.toLowerCase().includes(value)
                ? "block"
                : "none";
        });
    });
}

// 🔁 Redirect
function redirectToAlumni() {
    window.location.href = "alumni.html";
}
function validateForm() {
    let inputs = document.querySelectorAll("input");

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === "") {
            alert("Please fill all fields");
            return false;
        }
    }
    return true;
}
fetch("http://127.0.0.1:5000/alumni")