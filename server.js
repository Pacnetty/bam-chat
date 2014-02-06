var net 	= require('net'),
	carrier = require('carrier');

function debugString(msg) {
	var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	console.log("[" + time + "] " + msg);
}

var server = net.createServer(function(conn) {
	var client = carrier.carry(conn);
	client.on('line', function(line) {
		var data = JSON.parse(line);
		if( "type" in data ) {
			switch( data["type"] ) {
				case "action":
					// handle joining and leaving
					break;
				
				case "group":
					// handling joining, leaving, banning, and kicking from groups.
					break;
				case "message":
					// handle processing messages.
					break;
			}
		}
	});
	client.on('end', function() {

	});
});

server.listen(1234, function (){
	debugString("Server Bound.");
});