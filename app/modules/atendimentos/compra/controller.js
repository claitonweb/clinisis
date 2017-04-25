var http = require("http");
var sanitize = require('mongo-sanitize');
var crypto = require('crypto');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');

module.exports = function(app) {
    var model = require('../../../core/base/model').setDefault(app, __dirname);
	//var controller = require('../../../core/base/controller').buildCtrlAndRoutes(app, model, {}, 'consulta');
    
    var email = 'guilherme@mdcvacinas.com.br';
    var token = '938F9D45F45B45DE96C37FFE21E1E905'; //sandbox
    // var token : '0F87173ED3D0438D82B9534CFF4A665B', //oficial
                                

    var controller = {};
    
	controller.lista = function(req, res) {

        var pesquisaunica = '';

        if (req.query.pesquisaunica != undefined) {
            var pesquisaunica = new RegExp(req.query.pesquisaunica, 'i'); //like '%foo%'

            delete req.query.pesquisaunica;
        }

        var cliente = '';
        if(req.query.cliente!=undefined){
           cliente = req.query.cliente;
           delete req.query.cliente; 
        }

        if(req.query.externa!=undefined){
            req.query.externa = parseInt(req.query.externa);
        }

        if(req.query.datainicio!=undefined && req.query.datafim!=undefined){
            var dtinicio = new Date(req.query.datainicio);
            dtinicio.setHours(0,0,0,0);
             
            var dtfim = new Date(req.query.datafim);
            dtfim.setHours(23,59,59,59);
            
            req.query.data_atendimento = {
                $gte: dtinicio,
                $lte: dtfim
            };
            delete req.query.datainicio;
            delete req.query.datafim;
        }

        var consulta = model.find(req.query);



        consulta
            .populate('cliente')
            .populate('medico')
            .populate('usuario')
            .populate('cupom')
            
            .exec()
            .then(
                function(retorno) {
                    
                    for (var i = retorno.length - 1; i >= 0; i--) {
                        var remove = false;
                        
                        if(cliente!=''){
                            if(retorno[i].cliente!=undefined){
                              if(retorno[i].cliente._id != cliente){
                                remove = true;
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

   controller.deleta = function(req, res) {
        var _id = req.params.id;
        var saidamodel = app.modules.estoque.saidas.model;
        
        var atendimentomodel = app.modules.atendimentos.consulta.model;

        model.findByIdAndRemove(_id, function(retorno){
            var consulta = saidamodel.find({compra : _id});
            
            console.log('removida compra '+_id);

            consulta
            .exec()
            .then(
                function(saidas) {
                    
                    for (var i = saidas.length - 1; i >= 0; i--) {
                        
                        var idsaida = saidas[i]._id;
                       
                       saidamodel.findByIdAndRemove(idsaida, function(retornosaida){
                           console.log('removida saida '+idsaida);

                            var consultaatendimentos = atendimentomodel.find({saida : idsaida});
                            consultaatendimentos
                            .exec()
                            .then(
                                function(atendimentos){
                                    for (var i = atendimentos.length - 1; i >= 0; i--) {
                                        idatendimento = atendimentos[i]._id;
                                        atendimentomodel.findByIdAndRemove(idatendimento, function(retornoatendimento){
                                            console.log('removido atendimento '+idatendimento);
                                        });
                                    }
                                },
                                function(erro){
                                    console.error(erro);
                                    res.status(500).json(erro);
                                }
                            );
                       });
                    }
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
            );

            res.json(retorno);
        });
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
    
    controller.salva = function(req, res) {

        var _id = req.body._id;
        //var user = req.user;
       
        req.body.usuario = req.user.usuario._id;
        req.body.data_atendimento = new Date();
        
        if (_id) {

        	model.findByIdAndUpdate(_id, req.body).exec().then(
					function(retorno) {
					   
                       if(req.body.pagamentos.length > 0){
                        if(req.body.pagamentos[0].retorno!=undefined){
                            if(req.body.pagamentos[0].retorno.transaction.status[0] == 3){
                                var mongoose = require('mongoose');
                                var id = mongoose.Types.ObjectId(_id);
                                var saidamodel = app.modules.estoque.saidas.model;
                                var consulta = saidamodel.find({compra : id});
                                
                                consulta.exec().then(
                                function(retornos) {

                                    for (var i = retornos.length - 1; i >= 0; i--) {
                                        retornos[i].status = 'RP';

                                        saidamodel.findByIdAndUpdate(retornos[i]._id,retornos[i]).then(
                                            function(objetosaida) {
                                                    console.log('update status saída '+objetosaida._id);
                                            },
                                            function(erro) {
                                                console.log(erro);
                                                //res.status(500).json(erro);
                                            }
                                        );

                                    }

                                    console.log(retornos);
                                },
                                function(erro){

                                });    
                            }

                            


                            
                         }
                        }else{
                            console.log('compra sem pagamentos '+retorno.codigo);
                        }

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
                    var saidamodel = app.modules.estoque.saidas.model
                   
                    var status = 'RP';

                    if(req.body.pagamentos.length <= 0){
                          status = 'RNP';  
                    }
                    console.log(req.body.vacinas);
                    for (var i = 0; i < req.body.vacinas.length; i++) {
                       
                        var saida = {};
                        saida.lancamento = req.body.vacinas[i].lancamento._id;
                        saida.compra = objeto._id;
                        saida.usuario = req.user.usuario._id;
                        saida.status = status;

                        
                        saidamodel.create(saida).then(
                            function(objetosaida) {
                                    console.log('salva saída '+objetosaida._id);
                            },
                            function(erro) {
                                console.log(erro);
                                res.status(500).json(erro);
                            }
                        );
                    }

                	res.status(201).json(objeto);
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

    var xml2js;
    var parser;
    xml2js = require('xml2js');
    parser = new xml2js.Parser();

    controller.pagar = function(req, res) {

        var _id = req.params.id;

        model.findById(_id).
                populate(
                    {
                        path: 'cliente',
                    }
                ).
                exec().
                then(
                        function(retorno){

                            if (!retorno) {
                                throw new Error("Não encontrado");
                            }

                            //Inicializar a função com o e-mail e token
                            var pag, pagseguro;
                            pagseguro = require('pagseguro');
                            pag = new pagseguro({
                                email : email,
                                token : token,
                                mode : 'sandbox'
                            });

                            var objeto = retorno.toJSON();
                            //console.log(objeto);

                            //Configurando a moeda e a referência do pedido
                            pag.currency('BRL');
                            pag.reference(JSON.stringify(objeto._id));


                          //  var valor = '10.00'; //MUDAR!!!
                            var valor = 0;
                            for (var i = retorno.vacinas.length - 1; i >= 0; i--) {
                                valor = valor + retorno.vacinas[i].valor;
                            }
                            valor = valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                          
                            //Adicionando itens
                            pag.addItem({
                                id: 1,
                                description: 'Compra Vacinas ( Cod. '+objeto.codigo+ ' )',
                                amount: valor,
                                quantity: 1,
                                weight: 0
                            });

                            var ddd = '';

                            
                            

                            var phoneNumner = '';

                            if(retorno.cliente.telefone!=undefined){
                                phoneNumner = retorno.cliente.telefone;
                                phoneNumner = phoneNumner.substring(4,phoneNumner.length);

                                ddd = phoneNumner.substring(0,3);
                                ddd = ddd.replace('(','');
                                ddd = ddd.replace(')','');

                            }
                            
                            //Configurando as informações do comprador
                            
                            pag.buyer({
                                name: retorno.cliente.nome,
                                //name: 'Comprador Teste',
                                //email : retorno.cliente.username, //descomentar em produção
                                email: 'c84913130435921970813@sandbox.pagseguro.com.br', //senha : 1r924y6P7K7R4ULh
                                phoneAreaCode: ddd,
                                phoneNumber: phoneNumner.trim()
                            });
                            //console.log(pag);
                           // res.send(pag);

                            //Configuranto URLs de retorno e de notificação (Opcional)
                            //ver https://pagseguro.uol.com.br/v2/guia-de-integracao/finalizacao-do-pagamento.html#v2-item-redirecionando-o-comprador-para-uma-url-dinamica
                            //pag.setRedirectURL("http://www.lojamodelo.com.br/retorno");
                            //pag.setNotificationURL("http://www.lojamodelo.com.br/notificacao");

                            //Enviando o xml ao pagseguro
                            pag.send(function(err, result) {

                                if (err) {
                                    console.log(err);
                                }
                              //  console.log(result);
                                    parser.parseString(result, function (err, retornoPagseguro) {

                                        if(retornoPagseguro == undefined){
                                            res.status(500).json(result);
                                        }else{

                                            if(retornoPagseguro.errors != undefined){

                                                res.status(500).json(retornoPagseguro.errors);

                                            }else{
                                                var obj = retorno.toJSON();
                                                //console.log(obj);
                                                if(obj.pagamento == undefined){
                                                    obj.pagamento = {};
                                                    obj.pagamento.pagseguro = {};
                                                    obj.pagamento.pagseguro.retorno = {};
                                                }

                                                obj.pagamento.pagseguro.retorno = retornoPagseguro;

                                                model.findByIdAndUpdate(_id, obj).exec().then(
                                                    function(retorno) {
                                                        res.json(retornoPagseguro);
                                                    },
                                                    function(erro) {
                                                        console.error(erro);
                                                        res.status(500).json(erro);
                                                    }
                                                );
                                            }


                                       }



                                    });


                            });
                       } 

                );
        };

        controller.buscatransaction = function(req, res, codigoTransacao, callback) {

            if(req.params.transactionCode!=undefined){
                var codtransaction = req.params.transactionCode;
            }else{
                var codtransaction = codigoTransacao;
            }

           //console.log(typeof codigoTransacao);

            var request = require("request");
            var url = "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/"+codtransaction+"?email="+email+"&token="+token;
            request(url, function(error, response, body) {
                //
             //   console.log(body);
                parser.parseString(body, function (err, retornoPagseguro) {
                    if(codigoTransacao == undefined || codigoTransacao == '' || typeof codigoTransacao == 'function'){
                       // console.log(retornoPagseguro);
                        
                        if(retornoPagseguro == undefined){
                            res.status(500).json(body);
                        }else{

                            if(retornoPagseguro.errors != undefined){

                                res.status(500).json(retornoPagseguro.errors);

                            }else{
                                res.json(retornoPagseguro);
                            }
                        }
                    }else{
                        if(callback!=undefined){
                            callback(retornoPagseguro);
                        }else{
                            return retornoPagseguro;
                        }
                        //console.log(retornoPagseguro);
                        
                    }



                 });
            });
        }

        controller.transaction = function(req, res) {
            var codtransaction = req.params.transactionCode;

            var request = require("request");
            var url = "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/"+codtransaction+"?email="+email+"&token="+token;
            request(url, function(error, response, body) {
                if(!error){
                    parser.parseString(body, function (err, retornoPagseguro) {
                        res.json(retornoPagseguro);
                    });    
                }else{
                    console.log(error);
                }
                
            });
        }
    app.route('/pagseguro/:id')
        .get(controller.pagar);

    app.route('/pagseguro/transactions/:transactionCode')
        .get(controller.transaction);


	app.route('/compra')
	.get(controller.lista);
	
	app.route('/compra/teste')
	.get(controller.teste);
	
	app.route('/compra/:id')
	.get(controller.obtem)
    .delete(controller.deleta);
	
	app.route('/compra')
	.post(controller.salva);

    
	
	

    return controller;
};
