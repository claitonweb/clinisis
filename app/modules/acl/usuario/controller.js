var http = require("http");
var sanitize = require('mongo-sanitize');
var crypto = require('crypto');

module.exports = function(app) {
	var controller = {};
	var model = require('../../../core/base/model').setDefault(app, __dirname);

	controller.lista = function(req, res) {

		if (req.query.nome != undefined) {
			req.query.nome = new RegExp(req.query.nome, 'i'); //like '%foo%'
		}

		model.find(req.query).populate({
			path: 'perfil',
			populate: {
				path: 'resources',
				model: 'Resource'
			}
		}).exec().then(
			function(retorno) {
				res.json(retorno);
			},
			function(erro) {
				console.error(erro);
				res.status(500).json(erro);
			});
	};

	controller.obtem = function(req, res) {
		var _id = req.params.id;

		model.findById(_id).exec().then(function(retorno) {
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

		if (req.body.password != undefined && req.body.password != '') {
			var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
			req.body.password = hash;
		} else {
			delete req.body.password;
			delete req.body.oldpassword;
		}

		if (_id) {
			if (req.body.password == req.body.oldpassword) {
				delete req.body.password;
				delete req.body.oldpassword;
			}

			model.findByIdAndUpdate(_id, req.body).exec().then(
				function(retorno) {
					res.json(retorno);
				},
				function(erro) {
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

	controller.verificalogado = function(req, res) {
		if (req.isAuthenticated()) {
			var _id = req.user.usuario._id;

			model.findById(_id).populate({
				path: 'perfil',
				populate: {
					path: 'resources',
					model: 'Resource'

				}
			}).exec().then(function(retorno) {
					if (!retorno) {
						throw new Error("Não encontrado");
					}
					var objeto = {
						user: req.user,
						retorno: retorno.perfil
					};
					var user = [objeto];
					res.json(user);
				},

				function(erro) {
					console.log(erro);
					res.status(404).json(erro);
				});
		} else {
			res.status('401').json("Usuario não logado");
		}
	}

	app.route('/usuario')
		.get(controller.lista)
		.post(controller.salva);

	app.route('/usuario/verificalogado')
		.get(controller.verificalogado);

	app.route('/usuario/:id')
		.get(controller.obtem);

	return controller;
};
