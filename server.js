var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// io emit => send to all
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

var colours = ['red','blue','green','yellow','pink'];

function randomFromArray(items)
{
	return items[Math.floor(Math.random()*items.length)];   
}

//Player info
var players = {}
//io.on -> when read by everyone (so everyone triggers this)
io.on('connection', function(socket) {	
//socket.on -> specific socket reads (e.g. new player connects, this only runs once for that player.)
	socket.on('new player', function() {
		var coloura = randomFromArray(colours);
		players[socket.id] = {
			x: 300,
			y: 300,
			colour: coloura,
			};
		})
	socket.on('disconnect', function() {
		delete players[socket.id];   
		});
	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		if (data.left) {
		player.x -= 5;
		}
		if (data.up) {
		player.y -= 5;
		}
		if (data.right) {
		player.x += 5;
		}
		if (data.down) {
		player.y += 5;
		}
  });
});