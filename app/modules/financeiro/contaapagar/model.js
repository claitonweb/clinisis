var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		tipo : {
			type : mongoose.Schema.Types.Mixed, //fixa (f) ou previsão (p)
		},
		imposto : {
			type : mongoose.Schema.Types.Mixed, //se é imposto 0 ou 1
			default: 0
		},
		aliquota : {
			type : mongoose.Schema.Types.Mixed, //porcentagem
		},
		periodicidade : {
			type: mongoose.Schema.ObjectId,
			ref: 'Periodicidade'
		},
		diavencimento : {
			type : mongoose.Schema.Types.Mixed, //caso fixa
		},
		data_vencimento : {
			type : Date, //caso previsão
		},
		diasavisovencimento : {
			type : mongoose.Schema.Types.Mixed, //quantidade de dias para avisar antes do vencimento
		},
		fornecedor : {
			type: mongoose.Schema.ObjectId,
			ref: 'Fornecedor'
		},
		centrodecusto : {
			type: mongoose.Schema.ObjectId,
			ref: 'Centrocusto'
		},
		contacontabil : {
			type: mongoose.Schema.ObjectId,
			ref: 'Contacontabil'
		}

	});

	return mongoose.model('Contasapagar', schema);
};
