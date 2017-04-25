var mongoose = require('mongoose');
module.exports = function() {
	var schema = mongoose.Schema({
		sigla : {
			type : mongoose.Schema.Types.Mixed
		},
		nome : {
			type : mongoose.Schema.Types.Mixed
		}
	});
	return mongoose.model('estadoscidades',schema);

};
