var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get("/", function (req, res) {
  res.sendfile(__dirname + "/index.html");
});

//YAML = serverevents-clientConnect
io.on('connection', function(client){
  client.join('room');
  //YAML = serverevents-clientDisconnect
  client.on('disconnect', function(){
      console.log('client disconnect event fired');
      //INSERT YOUR CODE HERE
      io.emit('client has disconnected')
  });

  client.on('myMessage', function(msg){
    console.log(msg.msg);
    io.to('room').emit('roomMessage', msg.msg);
  });

  client.on('joinRoom', function(msg){
    client.join(msg.roomname);
  });
});

http.listen(3000, function(){
  io.sockets.adapter;
  console.log(io.sockets.adapter);
  console.log('listening on *:3000');
});
