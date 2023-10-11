const socket = io();

const chat = document.querySelector(".chat-container");
let messageContainer = chat.querySelector(".chatroom .chat-window .messages");
let userContainer = chat.querySelector(".chatroom .chat-window .users");
let username;

chat.querySelector(".new-connect #join-user").addEventListener("click", function () {
    username = document.getElementById("username").value;
    if (username.length == 0) {
        return;
    }

    socket.emit("connect-user", username);

    socket.on("error", function () {
        chat.querySelector(".new-connect .error").innerHTML = "Username already exist.";
    });

    socket.on("success", function () {
        chat.querySelector(".new-connect").style.display = "none";
        chat.querySelector(".chatroom").style.display = "flex";
    });
});

chat.querySelector(".chatroom #send-message").addEventListener("click", function () {
    let message = document.getElementById("message-input").value;
    if(message.length == 0) {
        return;
    }

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    socket.emit("send-message", {
        username: username,
        text: message,
        date: currentDate,
        time: currentTime
    });
    document.getElementById("message-input").value = '';
});

chat.querySelector(".chatroom #exit-chat").addEventListener("click", function () {
    socket.emit("disconnect-user", username);

    location.reload();
});

socket.on("message", function (update, textColor='#3498db', backgroundColor='#f1f1f1') {
    newMessage(update, textColor, backgroundColor);
});

socket.on("success", function (update) {
    usersList(update);
});

function usersList (usernames) {
    userContainer.querySelector(".list").innerHTML = '';
    for (let i = 0; i < usernames.length; i++) {
        let el = document.createElement("div")
        el.setAttribute("class", "user");
        el.innerHTML = usernames[i];
        userContainer.querySelector(".list").appendChild(el)
    }
}

function newMessage (message, color, backgroundColor) {
    let el = document.createElement("div")
    if (typeof message == "string") {
        el.setAttribute("class", "status");
        el.innerHTML = message;
    } else if (typeof message == "object") {
        el.setAttribute("class", "message");
        el.setAttribute("style", `background-color: ${backgroundColor}`)
        el.innerHTML = (`
<div class="message-title">
<div class="name" style="color: ${color}">${message.username}</div>
<div class="date">${message.date}</div>
<div class="time">${message.time}</div>
</div>
<div class="text">${message.text}</div>
`);
    }
    messageContainer.appendChild(el);
}