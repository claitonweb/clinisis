var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		ativo : {
			type : mongoose.Schema.Types.Mixed
		},
		nome : {
			type : mongoose.Schema.Types.Mixed
		},
		banco : {
			type: mongoose.Schema.ObjectId,
			ref: 'Banco'
		},
		agencia : {
			type: mongoose.Schema.ObjectId,
			ref: 'Agencia'
		},
		conta : {
			type: mongoose.Schema.Types.Mixed
		},
		digitoconta : {
			type: mongoose.Schema.Types.Mixed
		}
	});

	return mongoose.model('Domiciliobancario', schema);
};
