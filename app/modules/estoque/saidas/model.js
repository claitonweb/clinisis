var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		lancamento : {
			type: mongoose.Schema.ObjectId,
			ref: 'Lancamento'
		},
		status : {
			type : mongoose.Schema.Types.Mixed,
		},
		compra : {
			type: mongoose.Schema.ObjectId,
			ref: 'Compra'
		},
		data_lancamento : {
			type: Date,
			default : Date.now()
		},
		usuario : {
			type: mongoose.Schema.ObjectId,
			ref: 'Usuario'	
		}
	});

	return mongoose.model('Saida', schema);
};
