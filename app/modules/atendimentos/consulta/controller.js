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


        if(req.query.naousardata == undefined){

            if((req.query.datainicio==undefined && req.query.datafim==undefined) || (req.query.datainicio=='' && req.query.datafim=='')){
            
                var dthj = new Date();
                var dtontem = new Date();
                //dtontem.setUTCHours(0,0,0,0);
                dtontem.setHours(0,0,0,0);
                //console.log(dtontem);
                //dtontem.setUTCDate(dthj.getDate() - 1);
               
                var dtamanha = new Date();
                //dtamanha.setUTCHours(23,59,59,59);
                dtamanha.setHours(23,59,59,59);
                //console.log(dtamanha);
                //dtamanha.setUTCDate(dthj.getDate() + 1);
                req.query.data_atendimento = {
                    $gte: new Date(dtontem),
                    $lte: new Date(dtamanha)
                };
            }

            if(req.query.datainicio!=undefined && req.query.datafim!=undefined){
                var dtinicio = new Date(req.query.datainicio);
                dtinicio.setUTCHours(0,0,0,0);
                 
                var dtfim = new Date(req.query.datafim);
                dtfim.setUTCHours(23,59,59,59);
                
                req.query.data_atendimento = {
                    $gte: dtinicio,
                    $lte: dtfim
                };
                delete req.query.datainicio;
                delete req.query.datafim;
            }

        }else{
             delete req.query.naousardata;
        }

       
        var externa = ''; //compra 
        if(req.query.externa!=undefined){
            externa = req.query.externa;
            delete req.query.externa;
        }
       
       if(req.query._id!=undefined){
        delete req.query.data_atendimento;
       }

       var consulta = model.find(req.query);

       /* if (pesquisaunica != '') {
            consulta
                .or([{
                    cpf: pesquisaunica
                }, {
                    nome: pesquisaunica
                }, {
                    razaosocial: pesquisaunica
                }, {
                    cnpj: pesquisaunica
                }]);
        }*/

        consulta
            .populate('cliente')
            //.populate('saida')
            .populate({ 
                         path: 'saida',
                         populate: {
                           path: 'lancamento compra',
                           populate : 
                                [
                                    {
                                        path : 'vacina',
                                        select : 'nome',
                                        model : 'Vacina'
                                    },

                                    {
                                        path : 'cliente',
                                        select : 'nome',
                                        model : 'Cliente'
                                    }
                                ]

                                
                           
                         }
                      })
            .populate('profissional')
            .populate('usuario')
            
            .exec()
            .then(
                function(retorno) {

                    for (var i = retorno.length - 1; i >= 0; i--) {
                        var remove = false;
                        if(externa!=''){
                           //console.log(retorno[i].saida);
                           if(retorno[i].saida!=undefined && retorno[i].saida!=null && retorno.saida!=''){
                               
                               if(retorno[i].saida.compra.externa!=externa){    
                                 remove = true; 
                               }else{
                                   if(externa == 0){
                                    //console.log(retorno[i].saida.compra);
                                    if(retorno[i].saida.compra.externa == undefined || retorno[i].saida.compra.externa == ''){
                                        remove = false;
                                    }
                                   } 
                               }
                           }else{
                                remove = true;
                           }
                            
                        }

                	    if(remove){
                          retorno.splice(i,1);             
                        }  
                    }
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
			 .populate('cliente')
	         .populate('medico')
	         .populate('usuario')
	         .populate('pagamentos.formapagamento')
	         .populate('vacinas.vacina')
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
    controller.mudastatussaida = function(req){

        var dthj = new Date();
        dthj = dthj.getUTCDate() + '/' + (dthj.getUTCMonth()+1) + '/' + dthj.getUTCFullYear();
        
        var dtat = new Date(req.body.data_atendimento);
        dtat = dtat.getUTCDate() + '/' + (dtat.getUTCMonth()+1) + '/' + dtat.getUTCFullYear();

        var temdtat = false;
        if(req.body.data_atendimento != undefined){
            temdtat = true;
        }

        var status = '';
        var pago = true;
        if(req.body.compra.pagamentos.length <=0){
            pago = false;
        }

        if(req.body.data_atendimento!=undefined){
            if(temdtat && (req.body.profissional!=undefined && req.body.lado!=undefined)){
                status = 'B'; 
                console.log('Mudar status para baixa B');
            }else{

                if(pago){
                    status = 'RPA';    
                }else{
                    status = 'RNPA';
                }
                
                console.log('Mudar status para baixa '+status);
                
            }    
        }

        if(status!=''){
            var saidamodel = app.modules.estoque.saidas.model;
            var objsaida = {
                status : status
            };

            saidamodel.findByIdAndUpdate(req.body.saida, objsaida).exec().then(
                        function(retorno) {
                            console.log('alterou o status para '+status);     
                            //res.json(retorno);
                        },
                        function(erro) {
                            console.error(erro);
                            res.status(500).json(erro);
                        }
                    );
        }
        
        

    },
    controller.salva = function(req, res) {

        var _id = req.body._id;
        //var user = req.user;
       
        if (_id) {

        	model.findByIdAndUpdate(_id, req.body).exec().then(
					function(retorno) {
						res.json(retorno);
                        controller.mudastatussaida(req);
					},
					function(erro) {
						console.error(erro);
						res.status(500).json(erro);
					}
				);

        }
		else {
			
		    req.body.usuario = req.user.usuario._id;
            if(req.body.data_atendimento == undefined || req.body.data_atendimento == ''){
                req.body.data_atendimento = new Date();
            }
            
       	
           
			
			model.create(req.body).then(
                function(id) {
                      
                     controller.mudastatussaida(req);
                	 res.status(201).json("Salvo com sucesso!");
                },
                function(erro) {
                    console.log(erro);
                    res.status(500).json(erro);
                }
            );
        
		}
    };
    
    global.i = 0;

    controller.teste = function(req, res){
    	var vacinas = [{
    		vacina : '58142a16440be084295494b7'
    	},
    	{
    		vacina : '58142a16440be084295494b7'
    	}];
    	
    	var mongoose = require('mongoose');
    	var lancamentos = app.modules.estoque.lancamento.model;
    	var total = vacinas.length; 
    	var retornojson = [];
    	
    	for (i = 0; i < total; i++) {
    	//while(global.i<total){
    		
    		var idvacina = mongoose.Types.ObjectId(vacinas[i].vacina);
    		var consulta = lancamentos
    							.find({'vacina' : idvacina,'quantidade_atual' : {$gt : 0}})
    							.sort({data_lancamento : 1});
    			
            consulta
                .exec()
                .then(
                    function(retorno) {
                    	console.log('dar baixa na vacina' + idvacina);
                    	
                    	for (i = 0; i < retorno.length; i++) {
                    		
                    		console.log('dar update na quantidade atual do lançamento '+retorno[i]._id);
                    		console.log(retorno[i].quantidade_atual);
                    		break;
                    	}
                    	
                    	
                    	/*retornojson.push(retorno);
                    	console.log(retornojson);
                    	console.log('Posicao de I '+i);
                    	
                    	if(i == total){
                        	res.json(retornojson);
                        }*/
                    	
                    	
                    	
                    	
                    },
                    function(erro) {
                        console.error(erro);
                       // res.status(500).json(erro);
                    }
    			);
            
    	}
    	
    	res.json('ok');
    	
    	
    }
    
    controller.busca = function(){
    	
    }
    
    
	app.route('/consulta')
	.get(controller.lista);
	
	app.route('/consulta/teste')
	.get(controller.teste);
	
	app.route('/consulta/:id')
	.get(controller.obtem);
	
	app.route('/consulta')
	.post(controller.salva);
	
	

    return controller;
};
