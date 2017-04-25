var mongoose = require('mongoose');
module.exports = function() {
	var schema = mongoose.Schema({
		cnpj : {
			type : mongoose.Schema.Types.Mixed,
		},
		razaosocial : {
			type: mongoose.Schema.Types.Mixed
		},
		nome : { //fantasia
			type: mongoose.Schema.Types.Mixed
		},

		//contato
		email : {
			type : mongoose.Schema.Types.Mixed
		},
		telefone : {
			type: mongoose.Schema.Types.Mixed
		},
		responsavel : {
			type: mongoose.Schema.Types.Mixed
		},

		//endereco
		cep : {
			type: mongoose.Schema.Types.Mixed
		},
		estado : {
			type: mongoose.Schema.ObjectId,
			ref: 'estadoscidades'
		},
		cidade : {
			type: mongoose.Schema.Types.Mixed
		},
		bairro : {
			type: mongoose.Schema.Types.Mixed
		},
		logradouro : {
			type: mongoose.Schema.Types.Mixed
		},
		numero : {
			type: mongoose.Schema.Types.Mixed
		},
		complemento : {
			type: mongoose.Schema.Types.Mixed
		},
		tipo : {
			type: mongoose.Schema.Types.Mixed
		},
		correspondencia : {
			type: mongoose.Schema.Types.Mixed
		},

		observacoes : {
			type : mongoose.Schema.Types.Mixed
		},
		status : {
			type: mongoose.Schema.ObjectId,
			ref: 'Situacaocadastro'
		},
		ativo : {
			type : mongoose.Schema.Types.Mixed
		},
		dtcadastro : {
			type: Date,
			default: Date.now()
		},
		dtmodificacao : {
			type: Date,
			default: Date.now()
		}

		/*banco : {
			type: mongoose.Schema.ObjectId,
			ref: 'Banco'
		},
		agencia : {
			type: mongoose.Schema.ObjectId,
			ref: 'Agencia'
		},
		digitoagencia : {
			type: mongoose.Schema.Types.Mixed
		},
		conta : {
			type: mongoose.Schema.Types.Mixed
		},
		digitoconta : {
			type: mongoose.Schema.Types.Mixed
		}*/
	});
	return mongoose.model('Fornecedor', schema);

};
