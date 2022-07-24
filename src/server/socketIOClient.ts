import { io } from "socket.io-client";


export const socketIOClient = io('ws://localhost:3001');