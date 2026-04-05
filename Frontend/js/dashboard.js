const BASE_URL = "http://127.0.0.1:5000/api";


// ================= INIT =================
window.onload = function () {
    document.getElementById("username").innerText =
        "Welcome, " + (localStorage.getItem("name") || "User");

    document.getElementById("role").innerText =
        "Role: " + (localStorage.getItem("role") || "");

    loadAdvancedAnalytics(); // 🔥 IMPORTANT
};


// ================= LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}


// ================= NAVIGATION =================
function goToSearch() {
    window.location.href = "alumni.html";
}


// ================= LOAD PROFILE =================
async function loadProfile() {
    const user_id = localStorage.getItem("user_id");

    let res = await fetch(`${BASE_URL}/profile/${user_id}`);
    let data = await res.json();

    alert(`
        Skills: ${data.skills || "N/A"}
        Company: ${data.company || "N/A"}
    `);
}


// ================= LOAD REQUESTS =================
async function loadRequests() {
    const user_id = localStorage.getItem("user_id");

    let res = await fetch(`${BASE_URL}/requests/${user_id}`);
    let data = await res.json();

    if (!data.data || data.data.length === 0) {
        alert("No requests found");
        return;
    }

    let text = "Mentorship Requests:\n\n";

    data.data.forEach(r => {
        text += `${r.student_name} - ${r.status}\n`;
    });

    alert(text);
}


// ================= ANALYTICS =================
async function loadAdvancedAnalytics() {
    const user_id = localStorage.getItem("user_id");

    try {
        let res = await fetch(`${BASE_URL}/advanced-stats/${user_id}`);
        let data = await res.json();

        // TEXT DATA
        document.getElementById("total").innerText = data.total;
        document.getElementById("score").innerText = data.engagement_score;
        document.getElementById("insight").innerText = data.insight;

        // BAR CHART
        new Chart(document.getElementById("barChart"), {
            type: 'bar',
            data: {
                labels: ['Accepted', 'Pending', 'Rejected'],
                datasets: [{
                    label: 'Requests',
                    data: [data.accepted, data.pending, data.rejected]
                }]
            }
        });

        // PIE CHART
        new Chart(document.getElementById("pieChart"), {
            type: 'pie',
            data: {
                labels: ['Accepted', 'Pending', 'Rejected'],
                datasets: [{
                    data: [data.accepted, data.pending, data.rejected]
                }]
            }
        });

        // LINE CHART
        new Chart(document.getElementById("lineChart"), {
            type: 'line',
            data: {
                labels: Object.keys(data.growth),
                datasets: [{
                    label: 'Growth',
                    data: Object.values(data.growth)
                }]
            }
        });

    } catch (err) {
        console.error("Analytics error:", err);
    }
}