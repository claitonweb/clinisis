var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		nome: {
			type: mongoose.Schema.Types.Mixed,
		},
		contaapagar: {
			type: mongoose.Schema.ObjectId,
			ref: 'Contasapagar'
		},
		centrodecusto: {
			type: mongoose.Schema.ObjectId,
			ref: 'Centrocusto'
		},
		domiciliobancario: {
			type: mongoose.Schema.ObjectId,
			ref: 'Domiciliobancario'
		},
		usuario: {
			type: mongoose.Schema.ObjectId,
			ref: 'Usuario'
		},
		numeronota: {
			type: mongoose.Schema.Types.Mixed,
		},
		data_vencimento: {
			type: Date,
		},
		data_pagamento: {
			type: Date,
			//default: Date.now()
		},
		descricao: {
			type: mongoose.Schema.Types.Mixed,
		},
		valor: {
			type: mongoose.Schema.Types.Mixed,
		},
		valorimposto: {
			type: mongoose.Schema.Types.Mixed,
		},
		impostos: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Contasapagar'
			}
		],
	});

	return mongoose.model('Lancamentospagamento', schema);
};
