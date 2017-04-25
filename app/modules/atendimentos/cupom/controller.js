var http = require("http");
var sanitize = require('mongo-sanitize');
var crypto = require('crypto');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');

module.exports = function(app) {
    var model = require('../../../core/base/model').setDefault(app, __dirname);
	//var controller = require('../../../core/base/controller').buildCtrlAndRoutes(app, model, {}, 'consulta');
    
    var controller = {};
    
	controller.lista = function(req, res) {

        var pesquisaunica = '';

        if (req.query.pesquisaunica != undefined) {
            var pesquisaunica = new RegExp(req.query.pesquisaunica, 'i'); //like '%foo%'

            delete req.query.pesquisaunica;
        }

        var consulta = model.find(req.query);


        consulta
            .populate('vacina')
            
            .exec()
            .then(
                function(retorno) {
                	res.json(retorno);
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
			);
    };

   controller.obtem = function(req, res) {

		
			var _id = req.params.id;

			model.findById(_id)
			 .populate('vacina')
	         .exec().then(
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
		
	},
    
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

        }
		else {
			
			model.create(req.body).then(
                function(objeto) {
                    res.status(201).json("Salvo com sucesso!");
                },
                function(erro) {
                    console.log(erro);
                    res.status(500).json(erro);
                }
            );
        
		}
    };
    
    app.route('/cupom')
	.get(controller.lista);
	
    app.route('/cupom/:id')
	.get(controller.obtem);
	
	app.route('/cupom')
	.post(controller.salva);

    
	
	

    return controller;
};
