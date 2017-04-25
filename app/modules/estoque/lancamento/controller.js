var http = require("http");
var sanitize = require('mongo-sanitize');
var crypto = require('crypto');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');

module.exports = function(app) {
    var model = require('../../../core/base/model').setDefault(app, __dirname);
	//var controller = require('../../../modules/cadastros/medico/controller');
	var controller = {};
	var controllerbase = require('../../../core/base/controller').buildCtrlAndRoutes(app, model, controller, 'medico',false);
	//var controllerbase = require('../../../core/base/controller');
	delete controller.lista;
    delete controller.salva;

	
    controller.lista = function(req, res) {
    	var pesquisaunica = '';

        if (req.query.pesquisaunica != undefined) {
            var pesquisaunica = new RegExp(req.query.pesquisaunica, 'i'); //like '%foo%'

            delete req.query.pesquisaunica;
        }
		
		var consulta = model.find(req.query);

        
        consulta
            .sort({data_lancamento : -1,data_validade : 1})
            .populate('vacina')
            .populate('fornecedor')
            .populate('usuario')
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
    controller.salva = function(req, res) {
        var _id = req.body._id;
        req.body.usuario = req.user.usuario;
        
        req.body.quantidade_atual = parseInt(req.body.quantidade);
        req.body.quantidade = parseInt(req.body.quantidade);
        
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
    };
	
	
    
 	app.route('/lancamento')
	.get(controller.lista)
	.post(controller.salva);

	app.route('/lancamento/:id')
	.get(controllerbase.obtem);
   

	
    return controller;
};
