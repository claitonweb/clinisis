var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		vacina : {
			type: mongoose.Schema.ObjectId,
			ref: 'Vacina'
		},
		fornecedor : {
			type: mongoose.Schema.ObjectId,
			ref: 'Fornecedor'
		},
		quantidade : {
			type : mongoose.Schema.Types.Mixed,
		},
		quantidade_reserva : {
			type : mongoose.Schema.Types.Mixed,
		},
		quantidade_atual : {
			type : mongoose.Schema.Types.Mixed,
		},
		valor_compra : {
			type : mongoose.Schema.Types.Mixed	
		},
		data_compra : {
			type: Date
		},
		data_lancamento : {
			type: Date
		},
		lote : {
			type : mongoose.Schema.Types.Mixed		
		},
		data_validade : {
			type: Date
		},
		usuario : {
			type: mongoose.Schema.ObjectId,
			ref: 'Usuario'	
		}


	});

	return mongoose.model('Lancamento', schema);
};
