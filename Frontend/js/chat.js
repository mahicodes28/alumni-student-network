const socket = io("http://127.0.0.1:5000");

const user_id = localStorage.getItem("user_id");


// ================= SEND MESSAGE =================
function send() {
    let msg = document.getElementById("msg").value;

    if (!msg) return;

    socket.emit("send_message", {
        user_id: user_id,
        message: msg
    });

    addMessage(msg, "sent");

    document.getElementById("msg").value = "";
}


// ================= RECEIVE MESSAGE =================
socket.on("receive_message", data => {
    addMessage(data.message, "received");
});


// ================= ADD MESSAGE TO UI =================
function addMessage(text, type) {
    let box = document.getElementById("chatBox");

    let div = document.createElement("div");
    div.className = `message ${type}`;
    div.innerText = text;

    box.appendChild(div);

    // auto scroll
    box.scrollTop = box.scrollHeight;
}