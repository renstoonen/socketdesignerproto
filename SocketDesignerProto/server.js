var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//YAML = port
var PORT; //insert variable here

//array with object (string, socketobject) used for sending a message to a specific client
var connectedClients = [];

app.get("/", function (req, res) {
  res.sendfile(__dirname + "/index.html");
});


io.use(function(socket, next){
  var namesocketpair = {name: socket.handshake.query.socketname, socket : socket};
  connectedClients.push(namesocketpair);
  console.log(namesocketpair);
  next();
});
//YAML = serverevents-clientConnect
io.on('connection', function(client){
    //YAML = serverevents-clientDisconnect
  client.on('disconnect', function(){
      console.log('client disconnect event fired');
      //INSERT YOUR CODE HERE
      io.emit('client has disconnected');
  });

  client.on('myMessage', function(msg){
    console.log(msg.msg);
  });

  //sends message to one specific client with the given name given its in the array
  client.on('myPrivateMessage', function(msg){
    var socketToMessage = findSocketByKey(msg.socketid);
    io.sockets.connected[socketToMessage.id].emit('privatemessage' , {'msg' : 'testmessage'});
    console.log(msg.socketid);
  });

  client.on('myRoomMessage', function(msg){
    console.log('room: ' + msg.room + " ;; message: " + msg.msg)
    io.to(msg.room).emit(msg.msg);
  });

  client.on('myBroadcastMessage', function(msg){
    console.log('broadcast message: ' + msg.msg);
  });


  client.on('joinRoom', function(msg){
    client.join(msg.roomname);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function findSocketByKey(key){
  var returnsocket;
  connectedClients.forEach(function(namesocketpair){
    if(key === namesocketpair.name){
      returnsocket = namesocketpair.socket;
    }
  });
  return returnsocket;
}
