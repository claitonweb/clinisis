var mongoose = require('mongoose');
module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		dia : {
			type : mongoose.Schema.Types.Mixed,
		},
		mes : {
			type : mongoose.Schema.Types.Mixed,
		},
		ano : {
			type : mongoose.Schema.Types.Mixed,
		},
	});
	return mongoose.model('Feriado', schema);

};
