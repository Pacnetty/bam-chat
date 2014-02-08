var clients = require('./clients');

export.Group = function(id) {
	this.clients = [];
	this._id = id; 
	this.announce = function(data) {
		var client;
		for(var i=0; i<this.clients.length;i++) {
			client = this.clients[i];
			client.write(data + "\n");
		}
	};
	this.join = function(client) {
		var join_message = { "type": "group", "data": { "_id": this._id, "action": { "join": [ client ] } } }
		this.clients.push(client);
	}
};