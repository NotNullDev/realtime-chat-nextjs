import { Server, Socket } from "socket.io"

const io = new Server(3001, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    handleConnection(socket);

    console.log(`User connected: ${socket.id}`);
    socket.broadcast.emit("userConnected", socket.id);
  });

  io.on("disconnect", (socket, userId) => {
    console.log(`User disconnected: ${socket.id}`);
    socket.emit("userDisconnected", userId);
  });

  function handleConnection(socket: Socket) {
    socket.on("addMessage", (message) => {
      console.log(
        `received message ${message.content} from client: ${socket.id}`
      );
      socket.broadcast.emit("newMessage", {
        ...message,
      });
    });

    socket.on("removeMessage", (messageId) => {
      socket.broadcast.emit("removeMessage", messageId);
    });

    socket.on("userConnected", (username) => {
      socket.broadcast.emit("userConnected", username);
      console.log(`User connected: ${username}`);
    });

    socket.on("userDisconnected", (username) => {
      socket.broadcast.emit("userDisconnected", username);
      console.log(`User disconnected: ${username}`);
    });

    socket.on("kickAll", () => {
      io.of("/").disconnectSockets(true);
    });
  }