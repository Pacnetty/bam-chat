var net 		= require('net'),
	carrier 	= require('carrier'),
	formatter	= require('json-formater'),
	clients		= require('./clients'),
	request		= require('request');

function getBlocklandID(name, ip, callback) {
	var payload = { "NAME": name, "IP": ip };
	request.post( { url: 'http://auth.blockland.us/authQuery.php', form: payload }, function( error, response, body) {
		var spl = response['body'].split(' ');
		if( spl[0] == "NO" ) {
			callback( -1 );
		}
		else {
			callback( parseInt( spl[1] ) );
		}
	} );
}

function debugString(msg) {
	var time = new Date().toISOString().replace(  /T/, ' ' ).replace( /\..+/, '' );
	console.log( "[" + time + "] " + msg );
}

var action_json = {
	"type": "action",
	"data": {
		"action": "@ignore_value",
		"name": "@ignore_value"
	}
};
var action_data = {
	"action": '["data"]["action"]',
	"name": '["data"]["name"]'
};

var global_manager = new clients.ClientManager();

var server = net.createServer( function(conn) {
	var client = carrier.carry( conn );
	client.on( 'line' , function( line ) {
		try {
			var data = JSON.parse( line );
			debugString( "Message: " + line );
			if( "type" in data ) {
				switch( data["type"] ) {
					case "action":
						formatter( action_json, data, action_data, function( match, action_obj ) {
							if( match ) {
								switch( action_obj.action ) {
									case "join":
										var client = new clients.Client( action_obj.name, conn );
										
										global_manager.add_client( client );
										getBlocklandID( action_obj.name, conn.remoteAddress, client.setBLID );
								
										debugString( "User \"" + action_obj.name + "\" authenticated." );
										break;

									case "leave":
										// handle leaving different than disconnecting?
										global_manager.remove_conn( conn ); // just do this for now.
										break;
								}
							}
						});
						// handle joining and leaving
						break;
					
					case "group":
						// handling joining, leaving, banning, and kicking from groups.
						break;

					case "message":
						// handle processing messages.
						break;
					
					default:
						// error handling?
						break;
				}
			}
		} catch ( e ) {
			debugString( "Caught JSON Error: " + e );
		}

	});
	conn.on('end', function() {
		global_manager.remove_conn( conn );
		debugString( "Client Exit." );
	});
});

//console.log(global_manager);

server.listen( 1234, function () {
	debugString( "Server Bound." );
});