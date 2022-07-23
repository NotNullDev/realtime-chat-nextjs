import { WebSocketServer } from 'ws';

export const rawWss = new  WebSocketServer({ port: 4444 });

rawWss.on('connection', function connection(ws) {

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('Sucessfuly connected to the server !');

});

rawWss.on('close', function close() {
    console.log('Web socket server has been closed.');
});