var net 		= require('net'),
	carrier 	= require('carrier'),
	formatter	= require('json-formater'),
	clients		= require('./clients'),
	request		= require('request');

function debugString(msg) {
	var time = new Date().toISOString().replace(  /T/, ' ' ).replace( /\..+/, '' );
	console.log( "[" + time + "] " + msg );
}

var global_manager = new clients.ClientManager();

var server = net.createServer( function(conn) {
	var client = carrier.carry( conn );
	client.on( 'line' , function( line ) {
		try {
			var data = JSON.parse( line );
			debugString( "Message: " + line );
			if( "type" in data ) {
				switch( data["type"] ) {
					case "join":
						var client = new clients.Client( data["data"]["name"], conn );
										
						global_manager.add_client( client );
					
						var payload = { "NAME": client.name, "IP": conn.remoteAdddress };
						request.post( { url: 'http://auth.blockland.us/authQuery.php', form: payload }, function( error, response, body) {
							var spl = response['body'].split(' ');
							var id = parseInt( spl[1] );
							if( spl[1] == undefined ) {
								debugString( "Couldn't fetch BLID for " + client.name + ", disconnecting..." );
								global_manager.remove_conn( conn );
								conn.end();
							}
							else {
								debugString( "User \"" + data["data"]["name"] + "\" authenticated with BL_ID " + id.toString() + "." );
								client.blid = id;
							}
						} );
						break;
						
					case "leave":
						// handle leaving different than disconnecting?
						global_manager.remove_conn( conn ); // just do this for now.
						conn.end();
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
			debugString( "Caught Error: " + e );
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