const express = require("express");
const socket = require("socket.io");
const ip = require('ip');

//Init
const port = process.env.PORT || 8080;
var host = express();
var server = host.listen(port);
host.use(express.static("public"));
var io = socket(server);

console.log("Running server! Listening on port " + port);

io.on('connect', function (socket) {
    var room = socket.id;
    console.log("New Connection: ", socket.id);

    socket.on('join', function (id) {
        socket.join(room = id);
        console.log(socket.id, 'joined', id);
    });
    socket.on('host', function (id) {
        room = id;
    });
    socket.on('songUpdate', function (song) {
        io.to(room).emit('songUpdate', song);
        console.log(socket.id, 'broadcasted song');
    });
    socket.on('loadSong', function () {
        io.to(room).emit('loadSong', true);
        console.log(socket.id, 'requested song');
    });
    socket.on('disconnect', function(){
        console.log(socket.id + ' disconnected');
    });
    setTimeout(function () {
        socket.emit('ip', ip.address());
    }, 200);
});