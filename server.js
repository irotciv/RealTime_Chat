const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(require("path").join(__dirname+"/public")))

const registeredUsernames = [];

io.on('connection', (socket) => {
    socket.on('connect-user', (username) => {
        if (!registeredUsernames.includes(username)) {
            console.log(username + ' was connected.');
            registeredUsernames.push(username);
            socket.broadcast.emit("message", username + " joined the conversation");
            socket.emit("message",  "Welcome to the chat " + username + "!");
            socket.emit("success", registeredUsernames);
            socket.broadcast.emit("success", registeredUsernames);
        } else {
            console.log('Username already exist.');
            socket.emit("error");
        }
    });

    socket.on('send-message', (message) => {
        console.log(`Message: ${message.text} from ${message.username} at ${message.time} on ${message.date}.`);
        socket.broadcast.emit("message", message);
        socket.emit("message", message, "#312A38", "rgba(204, 255, 195, 0.7)");
    });

    socket.on('disconnect-user', (username) => {
        console.log(username + ' was disconnected.');
        socket.broadcast.emit("message", username + " left the conversation");
        const index = registeredUsernames.indexOf(username);
        if (index !== -1) {
            registeredUsernames.splice(index, 1);
        }
        socket.broadcast.emit("success", registeredUsernames);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
