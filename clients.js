function ClientManager() {
	this.clients = new Array();
	
	this.add_client = function ( client ) {
		if( this.clients.indexOf( client ) == -1 ) {
			this.clients.push( client );
		}
	};

	this.remove_client = function ( client ) {
		if( this.clients.indexOf( client ) != -1 ) {
			this.clients.splice( this.clients.indexOf( client ), 1 );
		}
	};

	this.remove_conn = function ( conn ) {
		var client;

		for( var i = 0; i < this.clients.length; i++ ) {
			client = this.clients[i];

			if( client.socket_client == conn ) {
				this.remove_client( client );
			}
		}
	};

	this.announce = function ( message, origin, exclude ) {
		var client;
		origin = origin || undefined;
		exclude = exclude || [];
		
		for( var i = 0; i < this.clients.length; i++ ) {
			client = this.clients[i];

			if( exclude.indexOf( client ) == -1 ) {
				client.write( JSON.parse( { "type": "group", "data": { "payload": message, "origin": "undefined" } } ) );
			}
		}
	};
}

module.exports.ClientManager = ClientManager;

module.exports.Client = function ( name, socket_client ) {
	this.name = name;
	this.blid = -1;
	this.socket_client = socket_client;

	this.setBLID = function ( blid ) { 
		this.blid = blid;
	};
};