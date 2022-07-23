import { Server } from "socket.io";

export const socketIoServer = new Server(3333, {

});

socketIoServer.on('connection', (socket) => {

    const clientIp = socket.request.socket.remoteAddress;

    const clientId = socket.id;

    console.log('New connection: ', clientIp, clientId);
    socket.once('disconnect', () => {
        console.log('Disconnected: ', clientIp, clientId);
    });
});