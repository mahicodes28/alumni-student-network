// Load user info
window.onload = function () {
    document.getElementById("username").innerText =
        "Welcome, " + (localStorage.getItem("name") || "User");

    document.getElementById("role").innerText =
        "Role: " + (localStorage.getItem("role") || "");
};


// Logout
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}


// Navigation
function goToSearch() {
    window.location.href = "alumni.html";
}