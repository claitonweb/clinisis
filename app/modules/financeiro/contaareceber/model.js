var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		tipo : {
			type : mongoose.Schema.Types.Mixed, //fixa (f) ou previsão (p)
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
		centrodecusto : {
			type: mongoose.Schema.ObjectId,
			ref: 'Centrocusto'
		},
		contacontabil : {
			type: mongoose.Schema.ObjectId,
			ref: 'Contacontabil'
		}
	});

	return mongoose.model('Contasareceber', schema);
};
