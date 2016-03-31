var express = require('express');
var port = process.env.PORT || 5000;
var app = express();

//var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(port);

app.use(express.static(__dirname + "/dist"));
/*
app.listen(port, function() {
  console.log("Listening on " + port);
});
*/
/*
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});
*/
//app.use(__dirname + "/dist");

io.on('connection', function (socket) {
  socket.emit('saludo', { mensaje: 'Hola' });
  socket.on('respuesta', function (data) {
    console.log(data);
  });
});




var com = require("serialport");

var serialPort = new com.SerialPort("/dev/tty.usbmodem1411", {
	baudrate: 9600,
	parser: com.parsers.readline('\n')
});

serialPort.on('open',function() {
  console.log('Port open');
});

var last;

serialPort.on('data', function(data) {
  console.log(data);
  //io.emit('chat message', data);

	try {
		var data = JSON.parse(data);
		// console.log("primer last: "+last+" actual: "+data.sensor);
		if (data.sensor != last) {
			if (data.sensor == 51) {
				console.log(data.sensor);
			}else if(last == 51 && data.sensor != 51){
				console.log("push");
				io.emit('sensor', data.sensor);
			}
		}
		last = data.sensor;
	} catch (e) {
		console.error(e);
	}

});

