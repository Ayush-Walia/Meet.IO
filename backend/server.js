const express = require('express');
const app = express();
const socketServer = require('http').Server(app);
const peerJSServer = require('http').Server(app);
const io = require('socket.io')(socketServer, {
  cors: { origin: "*" }
})
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(peerJSServer);
const socketServerPort = process.env.PORT || 3030;
const peerJSServerPort = process.env.PORT || 3031;

app.use('/peerjs', peerServer);

io.on('connection', socket => {
  // Event handler for adding socket to room.
  socket.on('join-room', (roomId, peerID, userName) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', peerID, socket.id, userName);

    // Message Event handler.
    socket.on('message', (message) => {
      io.to(roomId).emit('receiveMessage', message);
    });

    // Event handler to send peer info to newly joined socket. 
    socket.on('send-peer-info', (peerID, socketId, userName) => {
      io.to(socketId).emit('get-peer-info', peerID, userName);
    });

    // Send toggle video to everyone in room.
    socket.on('send-toggle-video', (peerID, roomId) => {
      io.to(roomId).emit('get-toggle-video', peerID);
    });

    // Send toggle video to specific peer in room.
    socket.on('send-toggle-video-to-peer', (peerID, participantSocketId) => {
      io.to(participantSocketId).emit('get-toggle-video', peerID);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', peerID);
    })
  })
})

socketServer.listen(socketServerPort, () => console.log(`socket server listening on ${socketServerPort}`));
peerJSServer.listen(peerJSServerPort, () => console.log(`peerJS server listening on ${peerJSServerPort}`));
