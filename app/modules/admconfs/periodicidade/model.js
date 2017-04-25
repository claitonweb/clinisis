var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		ativo : {
			type : mongoose.Schema.Types.Mixed
		},
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		dias : {
			type: mongoose.Schema.Types.Mixed
		}
	});

	return mongoose.model('Periodicidade', schema);
};
