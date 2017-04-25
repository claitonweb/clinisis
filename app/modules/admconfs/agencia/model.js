var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		codigo : {
			type : mongoose.Schema.Types.Mixed
		},
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		banco : {
			type: mongoose.Schema.ObjectId,
			ref: 'Banco'
		},
		nomegerente : {
			type : mongoose.Schema.Types.Mixed,
		},
		contato : {
			type : mongoose.Schema.Types.Mixed,
		},
	});

	return mongoose.model('Agencia', schema);
};
