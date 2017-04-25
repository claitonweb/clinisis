var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		codigo : {
			type : mongoose.Schema.Types.Mixed
		},
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		pai : {
			type: mongoose.Schema.ObjectId,
			ref: 'Contacontabil'
		}
	});

	return mongoose.model('Contacontabil', schema);
};

//modificar controller pra incluir
//model.find(req.query).sort({'codigo':'asc'}).exec().then(
