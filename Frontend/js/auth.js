const BASE_URL = "http://127.0.0.1:5000/api";


// ================= REGISTER =================
async function register() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let role = document.getElementById("role").value;

    // ✅ Validation
    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    try {
        let res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password, role })
        });

        let data = await res.json();

        if (res.ok) {
            alert(data.message);
            window.location.href = "login.html";
        } else {
            alert(data.error || "Registration failed");
        }

    } catch (err) {
        alert("Server error. Try again.");
        console.error(err);
    }
}


// ================= LOGIN =================
async function login() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    let msg = document.getElementById("msg");

    // ✅ Validation
    if (!email || !password) {
        msg.innerText = "Please enter email and password";
        return;
    }

    try {
        let res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        let data = await res.json();

        if (res.ok) {
            // ✅ Save user data
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", data.name);

            window.location.href = "dashboard.html";
        } else {
            msg.innerText = data.error || "Login failed";
        }

    } catch (err) {
        msg.innerText = "Server not responding";
        console.error(err);
    }
}