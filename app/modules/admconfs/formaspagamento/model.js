var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
		codigo : {
			type : mongoose.Schema.Types.Mixed
		},
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		pagseguro : {
			type : mongoose.Schema.Types.Mixed,	
		}
	});

	return mongoose.model('Formapagamento', schema);
};
