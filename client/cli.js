"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = require("socket.io-client");
var readline_1 = require("readline");
var socket = (0, socket_io_client_1.io)("http://localhost:5000");
function showTyping(username) {
    process.stdout.write("\r".concat(username, " is typing..."));
}
function clearTyping() {
    process.stdout.write("\r\x1b[K");
}
var USERNAME = process.argv[2].toLocaleLowerCase();
var TARGET = process.argv[3].toLocaleLowerCase();
// connection error
socket.on("connect_error", function (err) {
    console.log("Connection failed:", err.message);
});
// setup readline
var cli = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
socket.on("connect", function () {
    // set username
    socket.emit("set-username", USERNAME);
    // seting the room with the target username
    socket.emit("start-dm", TARGET);
    // sending the msg to the backend through the client
    console.log("Chatting with ".concat(TARGET));
    console.log("Type messages and press Enter...\n");
});
process.stdin.on("data", function (USERNAME) {
    socket.emit("typing");
});
cli.on("line", function (line) {
    var text = line.trim();
    if (!text)
        return;
    socket.emit("dm-message", text);
});
socket.on("typing", function (userName) {
    showTyping(userName);
    setTimeout(function () {
        clearTyping;
    }, 1500);
});
socket.on("dm-message", function (message) {
    clearTyping();
    var sender = message.from === USERNAME ? "You" : message.from;
    console.log("".concat(sender, " : ").concat(message.text, "          ").concat(message.time, " "));
});
// handle errors
socket.on("dm-error", function (err) {
    console.log("Error:", err);
});
// cleanup
socket.on("disconnect", function () {
    console.log("Disconnected");
    process.exit(0);
});
cli.on("SIGINT", function () {
    console.log("\nCaught Ctrl+C");
    cli.close();
});
cli.on("close", function () {
    console.log("Closing connection...");
    socket.disconnect();
    process.exit(0);
});
