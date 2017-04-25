var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence');

module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		cupom : {
			type: mongoose.Schema.ObjectId,
			ref: 'Cupom'
		},
		vacinas : [{
			vacina : {
				type: mongoose.Schema.ObjectId,
				ref: 'Vacina'
			},
			valor : {
				type : mongoose.Schema.Types.Mixed
			},
			quantidade : {
				type : mongoose.Schema.Types.Mixed	
			}
		}],
		pagamentos : [{
			formapagamento : {
				type : mongoose.Schema.ObjectId,
				ref : 'Formapagamento'
			},
			valor : {
				type : mongoose.Schema.Types.Mixed
			},
			data_pagamento : {
				type: Date	
			},
			pagseguro : {
				type : mongoose.Schema.Types.Mixed
			},
			retorno : {
				type : mongoose.Schema.Types.Mixed
			}
		}],
		data_atendimento : {
			type: Date
		},
		data_agendamento : {
			type: Date
		},
		usuario : {
			type: mongoose.Schema.ObjectId,
			ref: 'Usuario'	
		},
		cliente : {
			type: mongoose.Schema.ObjectId,
			ref: 'Cliente'	
		},
		medico : {
			type: mongoose.Schema.ObjectId,
			ref: 'Medico'	
		},
		externa : {
			type : mongoose.Schema.Types.Mixed,
			default : 0
		}

	});

	schema.plugin(AutoIncrement, {inc_field: 'codigo'});

	return mongoose.model('Compra', schema);
};
