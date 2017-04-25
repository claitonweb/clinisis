var mongoose = require('mongoose');
module.exports = function() {
	var schema = mongoose.Schema({
		ativo : {
			type : mongoose.Schema.Types.Mixed
		},
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		tipopessoa : {
			type: mongoose.Schema.Types.Mixed
		},
		cpf : {
			type: mongoose.Schema.Types.Mixed
		},
		dtnascimento : {
			type: Date
		},
		cnpj : {
			type: mongoose.Schema.Types.Mixed
		},
		razaosocial : {
			type: mongoose.Schema.Types.Mixed
		},
		nomefantasia : {
			type: mongoose.Schema.Types.Mixed
		},
		naturezajuridica : {
			type: mongoose.Schema.ObjectId,
			ref: 'Naturezajuridica'
		},
		cnae : {
			type: mongoose.Schema.ObjectId,
			ref: 'Cnae'
		},
		dtfundacao : {
			type: Date
		},
		mei : {
			type : mongoose.Schema.Types.Mixed
		},
		simples : {
			type : mongoose.Schema.Types.Mixed
		},
		endereco: [{
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
			}
		}],
		contato:[{
			email : {
				type : mongoose.Schema.Types.Mixed
			},
			telefone : {
				type: mongoose.Schema.Types.Mixed
			},
			responsavel : {
				type : mongoose.Schema.Types.Mixed
			}
		}]
		
	});
	return mongoose.model('Pessoa', schema);

};
