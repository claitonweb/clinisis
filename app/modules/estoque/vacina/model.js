var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		codigo : {
			type : mongoose.Schema.Types.Mixed
		},
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		valor_venda : {
			type : mongoose.Schema.Types.Mixed	
		},
		online : {
			type : mongoose.Schema.Types.Mixed	
		}
	});

	return mongoose.model('Vacina', schema);
};
