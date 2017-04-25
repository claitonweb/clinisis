var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

module.exports = function() {
	var schema = mongoose.Schema({
		nome: {
			type: mongoose.Schema.Types.Mixed,
		},
		username: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
			index: {
				unique: [true]
			}
		},
		password: {
			type: mongoose.Schema.Types.Mixed,
		},
		perfil: {
			type: mongoose.Schema.ObjectId,
			ref: 'Role'
		},
		ativo: {
			type: mongoose.Schema.Types.Mixed,
			default: '1'
		},
		pessoa: {
			type: mongoose.Schema.ObjectId,
			ref: 'Pessoa'
		}
	});

	schema.plugin(findOrCreate);

	var U = mongoose.model('Usuario', schema);
	

	return U;
};
