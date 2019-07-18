var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

var chatMessage = "";
var sendMessage = false;

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
	case 37: 
      movement.left = true;
      break;
case 38:
      movement.up = true;
      break;
    case 39:
      movement.right = true;
      break;
    case 40:
      movement.down = true;
      break;
	case 13: //enter
	break;
	case 8: //backspace
		  if(chatMessage.length > 0) chatMessage = chatMessage.substring(0, chatMessage.length - 1);
      break;
	  default: 
	  if(sendMessage == false) {
		    chatMessage = chatMessage + String.fromCharCode(event.keyCode);
	  }	
	  break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
	case 37: 
      movement.left = false;
      break;
	  case 38:
      movement.up = false;
      break;
	  case 39:
      movement.right = false;
      break;
	  case 40:
      movement.down = false;
      break;
	  break;
	  case 13: //enter
      sendMessage = true;
      break;
  }
});
socket.emit('new player');

setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

setInterval(function() {
	if(sendMessage == true){  
     	sendMessage = false;
	    console.log(chatMessage);
		socket.emit('sendmessage', chatMessage);
		chatMessage = "";
	}	
}, 100);

var chat = document.getElementById('chatWindow');
socket.on('chatState', function(messages) {	    
	  chat.innerHTML = messages;
	});
	
var currentMessage = document.getElementById('chatTextTyping');
setInterval(function() {
    currentMessage.innerHTML = chatMessage;
}, 0.5);

//canvas
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);

  for (var id in players) {
    var player = players[id];
	  context.fillStyle = player.colour;	
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  }
});