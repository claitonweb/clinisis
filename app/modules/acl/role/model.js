var mongoose = require('mongoose');
module.exports = function() {
	var schema = mongoose.Schema({
		nome : {
			type : mongoose.Schema.Types.Mixed,
		},
		resources: [{
			type: mongoose.Schema.ObjectId,
			ref: 'Resource'
		}]
	});
	return mongoose.model('Role', schema);

};
