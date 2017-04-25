var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence');

module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		codcupom : {
			type : mongoose.Schema.Types.Mixed,
		},
		descricao : {
			type : mongoose.Schema.Types.Mixed,
		},
		quantidade : {
			type : mongoose.Schema.Types.Mixed,
		},
		quantidade_usuario : {
			type : mongoose.Schema.Types.Mixed,
		},
		vacina : {
			type: mongoose.Schema.ObjectId,
			ref: 'Vacina'
		},
		valor_vacina : {
			type : mongoose.Schema.Types.Mixed,	
		},
		data_validade : {
			type: Date
		}
	});

	schema.plugin(AutoIncrement, {inc_field: 'codigo_cupom'});

	return mongoose.model('Cupom', schema);
};
