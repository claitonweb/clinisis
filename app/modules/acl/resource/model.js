var mongoose = require('mongoose');
module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		state : {
			type : mongoose.Schema.Types.Mixed
		}
	});
	return mongoose.model('Resource', schema);

};
