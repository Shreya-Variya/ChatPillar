const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};

//Connect to socket.io
io.on("connection", (socket) => {
  console.log("Socket connected");
  //New user join the chat event
  socket.on("new-user-joined", (name) => {
    console.log("New User:", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  //Send & Receive message event
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  //User leave chat event
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      socket.broadcast.emit("leave", users[socket.id]);
      delete users[socket.id];
    }
  });
});
