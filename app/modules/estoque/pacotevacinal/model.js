var mongoose = require('mongoose');
module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		codigo : {
			type : mongoose.Schema.Types.Mixed,
		},
		vacinas : [{
			type: mongoose.Schema.ObjectId,
			ref: 'Vacina'
		}]
	});
	return mongoose.model('PacoteVacinal', schema);

};
