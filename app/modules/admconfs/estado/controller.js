var http = require("http");
var sanitize = require('mongo-sanitize');

module.exports = function(app) {
	var controller = {};
	//console.log(__dirname);
	var model = require('../../../core/base/model').setDefault(app, __dirname);

	controller.lista = function(req, res) {


		if(req.query.nome!=undefined){
			req.query.nome = new RegExp(req.query.nome,'i'); //like '%foo%'
		}


		model.find(req.query).sort([['sigla', 'asc']]).exec().then(
			function(retorno) {
				res.json(retorno);
			}, function(erro) {
				console.error(erro);
				res.status(500).json(erro);
			});

		};

		controller.obtem = function(req, res) {
			var _id = req.params.id;

			model.findById(_id).exec().then(function(retorno)
			{

				if (!retorno) {
					throw new Error("Não encontrado");
				}
				res.json(retorno);
			},

			function(erro) {
				console.log(erro);
				res.status(404).json(erro);
			});
		};

		controller.salva = function(req, res) {

			var _id = req.body._id;
			if (_id) {
				model.findByIdAndUpdate(_id, req.body).exec().then(
					function(retorno) {
						res.json(retorno);
					},
					function(erro) {
						console.error(erro);
						res.status(500).json(erro);
					}
				);
			} else {
				model.create(req.body).then(
					function(retorno) {
						res.status(201).json(retorno);
					},
					function(erro) {
						console.log(erro);
						res.status(500).json(erro);
					}
				);
			}

		};

		app.route('/estado')
		.get(controller.lista)
		.post(controller.salva);

		app.route('/resource/:id')
		.get(controller.obtem);

		return controller;
	};
