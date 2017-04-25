var baseCtrl = {

	lista: function(model) {

		return function(req, res) {
			if (req.query.nome != undefined) {
				req.query.nome = new RegExp(req.query.nome, 'i'); //like '%foo%'
			}
			var pesquisaunica = '';
			if (req.query.pesquisaunica != undefined) {
				//pesquisaunica = new RegExp(req.query.cpfcnpj, 'i'); //like '%foo%'
				pesquisaunica = new RegExp(req.query.pesquisaunica, 'i'); //like '%foo%'
				delete req.query.pesquisaunica;
			}
			
			var consulta = model.find(req.query);
			if(pesquisaunica!=''){
				consulta
				.or([
						{cpf : pesquisaunica},
						{nome : pesquisaunica},
						{razaosocial : pesquisaunica},
						{cnpj : pesquisaunica},
						{codigo : pesquisaunica}

					]);
			}
			consulta.exec().then(
				function(retorno) {
					res.json(retorno);
				},
				function(erro) {
					console.error(erro);
					res.status(500).json(erro);
				}
			);
		};
	},

	obtem: function(model) {

		return function(req, res) {
			var _id = req.params.id;

			model.findById(_id).exec().then(
				function(retorno) {
					if (!retorno) {
						throw new Error("Não encontrado");
					}
					res.json(retorno);
				},
				function(erro) {
					console.log(erro);
					res.status(404).json(erro);
				}
			);
		};
	},

	salva: function(model) {

		return function(req, res) {
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
			}
			else {
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
		}
	}
};

module.exports = {

	buildCtrlAndRoutes: function(app, model, controller, resourceName, buildroute) {

		//joga as funções declaradas em ctrlFns do base para o controller
		for (var fn in baseCtrl) {
			controller[fn] = baseCtrl[fn](model);
		}

		//cria as rotas
		
		if(buildroute == undefined){
			app.route('/' + resourceName)
			.get(controller.lista)
			.post(controller.salva);

			app.route('/' + resourceName + '/:id')
				.get(controller.obtem);
				
		}
		
		//retorna o controller
		return controller;
	}

};
