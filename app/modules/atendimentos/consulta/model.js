var mongoose = require('mongoose');
//type: mongoose.Schema.ObjectId,ref: 'Vacina'
module.exports = function() {
	var schema = mongoose.Schema({
		usuario : {
			type: mongoose.Schema.ObjectId,
			ref: 'Usuario'	
		},
		saida : {
			type: mongoose.Schema.ObjectId,
			ref: 'Saida'	
		},
		cliente : {
			type: mongoose.Schema.ObjectId,
			ref: 'Cliente'	
		},
		data_atendimento : {
			type: Date
		},
		profissional : {
			type: mongoose.Schema.ObjectId,
			ref: 'Usuario'	
		},
		lado : {
			type : mongoose.Schema.Types.Mixed
		},
		observacoes : {
			type : mongoose.Schema.Types.Mixed	
		},
		status : {
			type : mongoose.Schema.Types.Mixed,
			default : 'AG'
		},
		dose : {
			type : mongoose.Schema.Types.Mixed,
			default : '0'
		}

	});

	return mongoose.model('Atendimento', schema);
};
