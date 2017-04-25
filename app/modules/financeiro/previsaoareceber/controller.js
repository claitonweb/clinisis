var http = require("http");
var sanitize = require('mongo-sanitize');

module.exports = function(app) {
	var controller = {};
	var model = require('../../../core/base/model').setDefault(app, __dirname);
	var model = app.modules.financeiro.contaareceber.model;

	controller.previsao = function(req, res) {
		var retornoPrevisao = {};
		global.arrayintermediario = {
			contas: {},
			contaslancadas: [],
			contasprevistas: {}
		};

		var d = new Date();
		if (req.query.mes == undefined) {
			var n = d.getMonth();
			var mes = n + 1;
		} else {
			var mes = req.query.mes;
		}

		var mesmenosum = mes - 1;
		var ano = d.getFullYear();

		var dtinicio = new Date(ano, mesmenosum, 1);
		var dtfim = new Date(ano, mes, 0);

		var objetopesquisa = {
			data_vencimento: {
				$gte: dtinicio.toISOString(),
				$lte: dtfim.toISOString()
			}
		}

		model.find(objetopesquisa).exec().then(
			function(retorno) {

				var total = retorno.length;
				if(total <=0){
					res.status(500).json('Nenhum registro encontrado');	
				}
				for (i = 0; i < total; i++) {
					var id = retorno[i]._id;

					global.arrayintermediario.contas[id] = {
						objeto: retorno[i],
						lancamentos: []
					};

					if ((i + 1) == total) {
						pegalancamentos(req, res);
					}

				}
			},
			function(erro) {
				console.error(erro);
				res.status(500).json(erro);
			});
	}

	function pegalancamentos(req, res) {

		//var Lancamentos = app.models.lancamentosrecebimento;
		var Lancamentos = app.modules.financeiro.lancamentorecebimento.model;

		var d = new Date();
		if (req.query.mes == undefined) {
			var n = d.getMonth();
			var mes = n + 1;
		} else {
			var mes = req.query.mes;
		}

		var mesmenosum = mes - 1;
		var ano = d.getFullYear();

		var dtinicio = new Date(ano, mesmenosum, 1);
		var dtfim = new Date(ano, mes, 0);

		Lancamentos.find().populate('contaareceber').exec().then(
			function(retorno) {

				var total = retorno.length;
				//console.log(retorno);
				for (i = 0; i < total; i++) {

					if (global.arrayintermediario.contas[retorno[i].contaareceber._id] != undefined) {
						global.arrayintermediario.contas[retorno[i].contaareceber._id].lancamentos.push(retorno[i]);
					}

					if ((i + 1) == total) {

						for (var idconta in global.arrayintermediario.contas) {

							var totallancamentos = global.arrayintermediario.contas[idconta].lancamentos.length;

							for (var i2 = 0; i2 <= totallancamentos - 1; i2++) {
								var lancamento = global.arrayintermediario.contas[idconta].lancamentos[i2];

								if (lancamento.data_pagamento != undefined) {
									var dtpagamento = lancamento.data_pagamento;
								} else {
									var dtpagamento = null;
								}
								//NUNCA VAI EXISTIR UM LANÇAMENTO SEM DATAPAGAMENTO, COLOQUEI MANUALMENTE NO MONGO
								//var dtpagamento = lancamento.datavencimento;

								if (dtpagamento >= dtinicio && dtpagamento <= dtfim) {
									global.arrayintermediario.contaslancadas.push(lancamento);
								} else {

									if (global.arrayintermediario.contasprevistas[idconta] == undefined) {
										global.arrayintermediario.contasprevistas[idconta] = lancamento.valor;
									}
									var valoranterior = global.arrayintermediario.contasprevistas[idconta];
									global.arrayintermediario.contasprevistas[idconta] = (valoranterior + lancamento.valor) / 2;

								}
							}

						}
					}

				}
				res.json(global.arrayintermediario);

			},
			function(erro) {
				console.error(erro);
				res.status(500).json(erro);
			});

	}

	app.route('/previsaoareceber')
		.get(controller.previsao);

	return controller;
};
