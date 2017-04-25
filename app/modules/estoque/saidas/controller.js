var http = require("http");
var sanitize = require('mongo-sanitize');
var crypto = require('crypto');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');

module.exports = function(app) {
    //console.log(app);
    var model = require('../../../core/base/model').setDefault(app, __dirname);
	var controller = {};
	var controllerbase = require('../../../core/base/controller').buildCtrlAndRoutes(app, model, controller, 'saidas',false);
	delete controller.lista;
   // delete controller.salva;

	
    controller.lista = function(req, res) {
    	var pesquisaunica = '';
        var compractrl = app.modules.atendimentos.compra.controller;
        if (req.query.nome != undefined) {
            //var pesquisaunica = new RegExp(req.query.pesquisaunica, 'i'); //like '%foo%'
            pesquisaunica = req.query.nome;
            delete req.query.nome;
        }
          
        var codigo = '';  
        if(req.query.codigo!=undefined){
            codigo = req.query.codigo;
            delete req.query.codigo;
           
        }

        var externa = ''; //compra 
        if(req.query.externa!=undefined){
            externa = req.query.externa;
            delete req.query.externa;
           
        }

        var vacina = '';  
        if(req.query.vacina!=undefined){
            vacina = req.query.vacina;
            delete req.query.vacina;
        }    
        
        var codigovacina = '';
        if(req.query.codigovacina!=undefined){
            codigovacina = req.query.codigovacina;
            delete req.query.codigovacina;
        }

        var idvacina = '';
        if(req.query.idvacina!=undefined){
            idvacina = req.query.idvacina;
            delete req.query.idvacina;
        }


        var cliente = '';
        if(req.query.cliente!=undefined){
            cliente = req.query.cliente;
            delete req.query.cliente;
        }

        var consulta = model.find(req.query);

      
        consulta
            .populate({ 
                         path: 'lancamento',
                         populate: {
                           path: 'vacina'
                         } 
                      })
            .populate({
                path : 'compra',
                populate : [{
                    path : 'cliente',
                    select : 'nome',
                    model : 'Cliente'
                },
                {
                    path : 'pagamentos.formapagamento',
                    select : 'nome',
                    model : 'Formapagamento'
                }]
            })
            .populate('usuario')
            .exec()
            .then(
                function(retorno) {

    				for (var i = retorno.length - 1; i >= 0; i--) {
                        var remove = false;
                        if(retorno[i].compra!=undefined && retorno[i].compra.cliente!=undefined){

                            /*if(retorno[i].compra.pagamentos.length > 0){
                                if(retorno[i].compra.pagamentos[0].pagseguro!=undefined){
                                    var codigoTransacao = retorno[i].compra.pagamentos[0].pagseguro;
                                    compractrl.buscatransaction(req,res,codigoTransacao, function(retornopag){
                                            console.log(i);
                                            //retorno[i].compra.pagamentos[0].pagseguro = '';
                                            //retorno[i].compra.pagamentos[0].retornopag = retornopag;
                                    });
                                    //console.log(pag);
                                }
                            }*/

                        if(pesquisaunica!=''){
                            var posicao = retorno[i].compra.cliente.nome.toLowerCase().indexOf(pesquisaunica);
                            console.log(pesquisaunica,retorno[i].compra.cliente.nome.toLowerCase(), posicao);
                            if(posicao < 0){
                              remove = true;
                            } 
                        } 

                    
                        if(codigo!=''){
                           
                           if(retorno[i].compra.codigo!=codigo){    
                             remove = true; 
                           }     
                        }

                        if(externa!=''){
                           if(retorno[i].compra.externa!=externa){    
                             remove = true; 
                           }else{
                               if(externa == 0){
                                if(retorno[i].compra.externa == undefined || retorno[i].compra.externa == ''){
                                    //remove = false;
                                }
                               } 
                           }     
                        }

                        if(vacina!=''){
                          var posicaov = retorno[i].lancamento.vacina.nome.toLowerCase().indexOf(vacina);
                          if(posicaov < 0){
                            remove = true;
                          }    
                        }

                        if(idvacina!=''){
                          if(retorno[i].lancamento.vacina._id!=idvacina){
                            remove = true;
                          }    
                        }

                        if(codigovacina!=''){
                          var posicaoc = retorno[i].lancamento.vacina.codigo.toLowerCase().indexOf(codigovacina);
                          if(posicaoc < 0){
                            remove = true;
                          }    
                        }

                        if(cliente!=''){
                            if(retorno[i].compra.cliente == undefined){
                                remove = true
                            }else{
                                if(retorno[i].compra.cliente._id != cliente){
                                  remove = true;
                                }    
                            }
                        }
                    }else{
                        remove = true;
                    }
                        if(remove){
                            //console.log(remove);
                          retorno.splice(i,1);             
                        }
                    }
                    //console.log(retorno);
                    res.json(retorno);
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
			);
    };
   /* controller.salva = function(req, res) {
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
	*/
	
    
 	app.route('/saidas')
	.get(controller.lista)
	.post(controller.salva);

	app.route('/saidas/:id')
	.get(controllerbase.obtem);
   

	
    return controller;
};
