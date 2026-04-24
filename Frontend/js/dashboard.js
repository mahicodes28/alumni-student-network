const BASE_URL = "http://127.0.0.1:5000/api";


// ================= INIT =================
window.onload = function () {
    const role = localStorage.getItem("role");
    
    document.getElementById("username").innerText =
        "Welcome, " + (localStorage.getItem("name") || "User");

    document.getElementById("role").innerText =
        "Role: " + (role || "");

    applyRoleBasedUI(role); // 🔥 NEW
    loadAdvancedAnalytics(); 
};


// ================= ROLE UI =================
function applyRoleBasedUI(role) {
    if (role === "alumni") {
        // Alumni don't usually need to "find alumni" themselves
        if (document.getElementById("sidebarSearchBtn")) 
            document.getElementById("sidebarSearchBtn").style.display = "none";
        
        if (document.getElementById("searchCard"))
            document.getElementById("searchCard").style.display = "none";
        
        document.getElementById("requestsHeader").innerText = "📩 Received Requests";
    } else {
        document.getElementById("requestsHeader").innerText = "📩 Sent Requests";
    }
}


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
    const role = localStorage.getItem("role");

    let res = await fetch(`${BASE_URL}/requests/${user_id}`);
    let data = await res.json();

    const section = document.getElementById("requestsListSection");
    const container = document.getElementById("requestsContainer");
    const title = document.getElementById("listTitle");

    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
    
    title.innerText = role === "alumni" ? "📩 Received Requests" : "📩 Sent Requests";
    container.innerHTML = "";

    if (!data.data || data.data.length === 0) {
        container.innerHTML = "<p>No requests found</p>";
        return;
    }

    data.data.forEach(r => {
        const card = document.createElement("div");
        card.className = "card";
        
        let actions = "";
        if (role === "alumni" && r.status === "pending") {
            actions = `
                <div style="margin-top:10px;">
                    <button onclick="updateStatus(${r.request_id}, 'accepted')" style="background:#10b981; border:none; color:white; padding:5px 10px; border-radius:5px; cursor:pointer;">Accept</button>
                    <button onclick="updateStatus(${r.request_id}, 'rejected')" style="background:#ef4444; border:none; color:white; padding:5px 10px; border-radius:5px; cursor:pointer;">Reject</button>
                </div>
            `;
        }

        card.innerHTML = `
            <h3>${r.other_name}</h3>
            <p>Status: <b style="color:${getStatusColor(r.status)}">${r.status}</b></p>
            ${actions}
        `;
        container.appendChild(card);
    });
}

function getStatusColor(status) {
    if (status === "accepted") return "#10b981";
    if (status === "rejected") return "#ef4444";
    return "#f59e0b";
}

async function updateStatus(requestId, status) {
    try {
        let res = await fetch(`${BASE_URL}/request/${requestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        if (res.ok) {
            alert(`Request ${status}`);
            loadRequests(); // Refresh list
            loadAdvancedAnalytics(); // Refresh stats
        } else {
            alert("Failed to update status");
        }
    } catch (err) {
        console.error("Update error:", err);
    }
}


// ================= ANALYTICS =================
async function loadAdvancedAnalytics() {
    const user_id = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");

    try {
        let res = await fetch(`${BASE_URL}/advanced-stats/${user_id}`);
        let data = await res.json();

        // TEXT DATA
        document.getElementById("total").innerText = data.total;
        document.getElementById("score").innerText = data.engagement_score + "%";
        document.getElementById("insight").innerText = data.insight;

        const chartLabel = role === "alumni" ? "Requests Received" : "Requests Sent";

        // BAR CHART
        new Chart(document.getElementById("barChart"), {
            type: 'bar',
            data: {
                labels: ['Accepted', 'Pending', 'Rejected'],
                datasets: [{
                    label: chartLabel,
                    data: [data.accepted, data.pending, data.rejected],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            }
        });

        // PIE CHART
        new Chart(document.getElementById("pieChart"), {
            type: 'pie',
            data: {
                labels: ['Accepted', 'Pending', 'Rejected'],
                datasets: [{
                    data: [data.accepted, data.pending, data.rejected],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            }
        });

        // LINE CHART
        new Chart(document.getElementById("lineChart"), {
            type: 'line',
            data: {
                labels: Object.keys(data.growth),
                datasets: [{
                    label: 'Activity Over Time',
                    data: Object.values(data.growth),
                    borderColor: '#3b82f6',
                    tension: 0.3
                }]
            }
        });

    } catch (err) {
        console.error("Analytics error:", err);
    }
}