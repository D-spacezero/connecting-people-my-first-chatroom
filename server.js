import * as path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const http = createServer(app);
const io = new Server(http);
const port = process.env.PORT || 4242;

const historySize = 50;
let history = [];
let onlineUsers = 0;

app.use(express.static(path.resolve('public')));

io.on('connection', (socket) => {
  onlineUsers++;
  console.log('A user connected. Online users:', onlineUsers);
  io.emit('userCount', onlineUsers);
  
  io.emit('history', history);

  socket.on('message', (message) => {
    while (history.length > historySize) {
      history.shift();
    }
    history.push(message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    onlineUsers--;
    console.log('A user disconnected. Online users:', onlineUsers);
    io.emit('userCount', onlineUsers);
  });
});

http.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
});
