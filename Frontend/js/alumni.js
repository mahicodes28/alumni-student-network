const BASE_URL = "http://127.0.0.1:5000/api";


// ================= SEARCH =================
async function search() {
    const skill = document.getElementById("skill").value.trim();
    const div = document.getElementById("results");

    div.innerHTML = "<p>Loading...</p>";

    try {
        let res = await fetch(`${BASE_URL}/alumni?skill=${skill}`);
        let data = await res.json();

        div.innerHTML = "";

        if (!data.data || data.data.length === 0) {
            div.innerHTML = "<p>No alumni found</p>";
            return;
        }

        data.data.forEach(a => {
            div.innerHTML += `
                <div class="card">
                    <h3>${a.name}</h3>
                    <p><strong>Skills:</strong> ${a.skills || "N/A"}</p>
                    <p><strong>Company:</strong> ${a.company || "N/A"}</p>
                    <p><strong>Experience:</strong> ${a.experience || "N/A"}</p>

                    <button onclick="requestMentor(${a.id})">
                        Request Mentorship
                    </button>
                </div>
            `;
        });

    } catch (err) {
        div.innerHTML = "<p>Error loading data</p>";
        console.error(err);
    }
}


// ================= REQUEST =================
async function requestMentor(alumni_id) {
    try {
        let res = await fetch(`${BASE_URL}/request`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                student_id: localStorage.getItem("user_id"),
                alumni_id: alumni_id
            })
        });

        let data = await res.json();

        alert(data.message || data.error);

    } catch (err) {
        alert("Failed to send request");
        console.error(err);
    }
}