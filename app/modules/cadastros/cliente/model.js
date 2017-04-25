var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		clientepai : {
			type: mongoose.Schema.ObjectId,
			ref: 'Cliente'
		},
		login : {
			type : mongoose.Schema.Types.Mixed
		},
		password : {
			type : mongoose.Schema.Types.Mixed,
		},
		/*username : {
			type : mongoose.Schema.Types.Mixed,
			required : true,
			index : {
				unique : [true]
			}
		},*/
		emailconfirmado : {
			type : mongoose.Schema.Types.Mixed,
			default: '0'
		},

		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		cpfcnpj : {
			type: mongoose.Schema.Types.Mixed
		},
		rg : {
			type: mongoose.Schema.Types.Mixed
		},
		dtnascimento : {
			type: Date
		},
		medico : {
			type: mongoose.Schema.ObjectId,
			ref: 'Medico'
		},

		//contato
		email : {
			type : mongoose.Schema.Types.Mixed
		},
		telefone : {
			type: mongoose.Schema.Types.Mixed
		},
		responsavel1 : {
			type: mongoose.Schema.Types.Mixed
		},
		responsavel2 : {
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
		tipopessoa : {
			type: mongoose.Schema.Types.Mixed
		},
		nomefantasia : {
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
		excluido : {
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
	});
	return mongoose.model('Cliente', schema);

};
