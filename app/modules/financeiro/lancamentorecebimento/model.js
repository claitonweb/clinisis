var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		contaareceber : {
			type: mongoose.Schema.ObjectId,
			ref: 'Contasareceber'
		},
		centrodecusto : {
			type: mongoose.Schema.ObjectId,
			ref: 'Centrocusto'
		},
		domiciliobancario : {
			type: mongoose.Schema.ObjectId,
			ref: 'Domiciliobancario'
		},
		cliente : {
			type: mongoose.Schema.ObjectId,
			ref: 'Cliente'
		},
		usuario : {
			type: mongoose.Schema.ObjectId,
			ref: 'Usuario'
		},
		data_vencimento : {
			type : Date,
		},
		data_pagamento : {
			type : Date
			//default: Date.now()
		},
		descricao : {
			type : mongoose.Schema.Types.Mixed,
		},
		valor : {
			type : mongoose.Schema.Types.Mixed,
		},
	});

	return mongoose.model('Lancamentosrecebimento', schema);
};
