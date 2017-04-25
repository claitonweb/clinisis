var http = require("http");
var sanitize = require('mongo-sanitize');
var crypto = require('crypto');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');

module.exports = function(app) {
    var model = require('../../../core/base/model').setDefault(app, __dirname);
	var controller = {};
	var controllerbase = require('../../../core/base/controller').buildCtrlAndRoutes(app, model, controller, 'medico',false);
	delete controller.lista;
	
    controller.lista = function(req, res) {
    	var pesquisaunica = '';

        if (req.query.pesquisaunica != undefined) {
            var pesquisaunica = new RegExp(req.query.pesquisaunica, 'i'); //like '%foo%'

            delete req.query.pesquisaunica;
        }
		
		var consulta = model.find(req.query);

        
        consulta
            .populate('periodicidade')
            .populate('contacontabil')
            .populate('centrodecusto')

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
	
	
    
 	app.route('/contaapagar')
	.get(controller.lista)
	.post(controllerbase.salva);

	app.route('/contaapagar/:id')
	.get(controllerbase.obtem);
   

	
    return controller;
};
