
const path = require('path')
const express = require('express')
const app = express()
var users=0;
app.use(express.static(path.join(__dirname, '/public')))
const port = process.env.PORT || 3000
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
function onConnection(socket) {
	
  socket.on('drawing', function(data) {
		socket.broadcast.emit('drawing', data)
	})

	socket.on('clear_canvas', function() {
	  io.emit('clear_canvas')
	})
	
	
	
	socket.on(
		'colorChanged',
		
		(color) => io.emit('changeAllColors', color)
	)
	socket.on(
		'sizeChanged',
		(size) => io.emit('changeAllSizes', size)
	)

	
}


io.on('connection', onConnection)


server.listen(port, () => console.log('listening on port ' + port));



