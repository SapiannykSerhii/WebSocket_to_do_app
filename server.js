const express = require('express');
const socket = require('socket.io')

const tasks = [];

const app = express(); 

const server = app.listen(9000, () => {
  console.log('Server is running..')
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id - ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task)
    socket.broadcast.emit('addTask', task)
  });

  socket.on('removeTask', (id) => {
    tasks.filter(task => task.id !== id)
    socket.broadcast.emit('removeTask', id)
  });

});

app.use((req, res) => {
  res.status(404).send( { message: 'Not found..' } )
});