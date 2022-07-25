import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { Server } from 'socket.io'

const socketio = (req: NextApiRequest, res: NextApiResponse) => {


    res.status(200).json({ status: 'Not implemented' });

//   if (!res.socket.server.io) {
//     console.log('*First use, starting socket.io')

//       const io = new Server(parseInt(process.env.SOCKET_IO_PORT ?? "3001"));

//       io.on("connection", (socket) => {
//         socket.on("addMessage", (message) => {
//             console.log(
//               `received message ${message.content} from client: ${socket.id}`
//             );
//             socket.broadcast.emit("newMessage", {
//               ...message,
//             });
//           });

//           socket.on("removeMessage", (messageId) => {
//             socket.broadcast.emit("removeMessage", messageId);
//           });

//           socket.on("userConnected", (username) => {
//             socket.broadcast.emit("userConnected", username);
//             console.log(`User connected: ${username}`);
//           });

//           socket.on("userDisconnected", (username) => {
//             socket.broadcast.emit("userDisconnected", username);
//             console.log(`User disconnected: ${username}`);
//           });

//           socket.on("kickAll", () => {
//             io.of("/").disconnectSockets(true);
//           });

//         console.log(`User connected: ${socket.id}`);
//         socket.broadcast.emit("userConnected", socket.id);
//       });

//       io.on("disconnect", (socket, userId) => {
//         console.log(`User disconnected: ${socket.id}`);
//         socket.emit("userDisconnected", userId);
//       });


//     res.socket.server.io = io
//   } else {
//     console.log('socket.io already running')
//   }
//   res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}