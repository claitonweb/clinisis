module.exports = function(app) {
	var controller = {};
	var model = require('../../../core/base/model').setDefault(app, __dirname);

	controller.lista = function(req, res) {
		if(req.query.nome!=undefined){
			req.query.nome = new RegExp(req.query.nome,'i'); //like '%foo%'
		}

		model.find(req.query).populate('banco').populate('agencia').exec().then(
				function(retorno) {
					res.json(retorno);
				}, function(erro) {
					console.error(erro);
					res.status(500).json(erro);
				});
	};

	return controller;
};
