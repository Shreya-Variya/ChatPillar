const socket = io("https://chatpillar.onrender.com");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const joinContainer = document.getElementById("join-container");
const joinBtn = document.getElementById("joinBtn");
const nameInp = document.getElementById("nameInp");

let name = "";

var audio = new Audio("RingTone Sound.mp3");

//Append the message
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
  if (position === "left") {
    audio.play();
  }
};

//Add listener on send button and send the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message === "") return;
  append(`You: ${message}`, `right`);
  socket.emit("send", message);
  messageInput.value = "";
  messageInput.focus();
});

joinBtn.addEventListener("click", () => {
  name = nameInp.value.trim();

  if (name === "") {
    alert("Please enter your name");
    return;
  }

  socket.emit("new-user-joined", name);

  messageInput.disabled = false;
  joinContainer.style.display = "none";
});

nameInp.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    joinBtn.click();
  }
});

// const name = prompt("enter your name to join");
// socket.emit("new-user-joined", name);

//Send joine message
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, `left`);
});

//Receive the message
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, `left`);
});

//Leave the chat
socket.on("leave", (name) => {
  append(`${name} left the chat`, `left`);
});
