const socket = io("http://127.0.0.1:5000");

const user_id = localStorage.getItem("user_id");
const username = localStorage.getItem("name") || "User";


// ================= SEND MESSAGE =================
function send() {
    let input = document.getElementById("msg");
    let msg = input.value.trim();

    if (!msg) return;

    const messageData = {
        user_id: user_id,
        name: username,
        message: msg,
        time: new Date().toLocaleTimeString()
    };

    socket.emit("send_message", messageData);

    // show own message
    addMessage(messageData, "sent");

    input.value = "";
}


// ================= ENTER KEY SUPPORT =================
document.getElementById("msg").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        send();
    }
});


// ================= RECEIVE MESSAGE =================
socket.on("receive_message", data => {
    // prevent duplicate of your own message
    if (data.user_id == user_id) return;

    addMessage(data, "received");
});


// ================= ADD MESSAGE TO UI =================
function addMessage(data, type) {
    let box = document.getElementById("chatBox");

    let div = document.createElement("div");
    div.className = `message ${type}`;

    div.innerHTML = `
        <strong>${data.name || "User"}</strong><br>
        ${data.message}<br>
        <small>${data.time || ""}</small>
    `;

    box.appendChild(div);

    // auto scroll
    box.scrollTop = box.scrollHeight;
}