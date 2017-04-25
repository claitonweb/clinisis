app.controller('AtendimentosCompraCtrl', function($location, $rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, $resource, Api) {
	
	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Atendimentos'
		},
		resource: {
			name: 'compra',
			desc: 'Compras'
		},
		states: {
			lista: {},
			cadastro: {},
			visualizar: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "codigo",
				desc: "Código"
			},
			{
				name: "cliente",
				desc: "Cliente",
				subname : 'nome'
			},
			{
				name: "data_atendimento",
				desc: "Dt Atendimento"
			}
			
		],
		fields: {
			nome: {}
		}
	};
	
	$scope.buscapaciente = function (){
		if($scope.modelObj.nomepacientepesquisa.length > 3){
			
			$scope.clientes = BaseCtrl.getAll(Api.cadastros.cliente,{pesquisaunica : $scope.modelObj.nomepacientepesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.clientes = '';
				}
			});
		}else{
			$scope.clientes = '';
		}
	}
	
	$scope.buscavacina = function (){
		
		if($scope.modelObj.nomevacinapesquisa.length >= 3){
			
			$scope.vacinas = BaseCtrl.getAll(Api.estoque.vacina,{pesquisaunica : $scope.modelObj.nomevacinapesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.vacinas = '';
				}
			});
		}else{
			$scope.vacinas = '';
		}
	}
	
	$scope.buscapacote = function (){
		
		if($scope.modelObj.nomepacotepesquisa.length > 3){
			
			$scope.pacotes = BaseCtrl.getAll(Api.estoque.pacotevacinal,{pesquisaunica : $scope.modelObj.nomepacotepesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.pacotes = '';
				}
			});
		}else{
			$scope.pacotes = '';
		}
	}
	
	$scope.adicionarpacote = function(pacote){
		angular.forEach(pacote.vacinas,function(values, key){
			
			BaseCtrl.getAll(Api.estoque.vacina,{_id : values},function(retorno){
				$scope.adicionarvacina(retorno[0]);
			});
			
		});
	}
	
	$scope.total = 0;
	$scope.saldo = 0;
	
	$scope.calculasaldo = function(){
		
		$scope.saldo = 0;
		var totpagamentos = 0;
		angular.forEach($scope.modelObj.pagamentos,function(values, key){
			totpagamentos+= values.valor;
		});
		
		$scope.saldo = $scope.total - totpagamentos;
		$scope.modelObj.valorpgto = $scope.saldo;
	}
	
	$scope.adicionarvacina = function(vacina){
		
		var qtd = $scope.modelObj.qtdvacinapesquisa;
		if(qtd == '' || qtd == undefined || qtd < 1){
			qtd = 1;
		}
		BaseCtrl.getAll(Api.estoque.lancamento,{vacina : vacina._id},function(retorno){
			if(retorno.length > 0){
				
				


				for (var i = 1; i <=qtd; i++) {
					var vac = angular.copy(vacina);			
					var obj = {
							vacina : vac._id,
							valor : vac.valor_venda,
							quantidade : 1,
							objvacina : vac
					}
					obj.lancamento = retorno[0];
					$scope.modelObj.vacinas.push(obj);
					$scope.total = $scope.total+vac.valor_venda;
					$scope.calculasaldo();	
				}

				$scope.modelObj.idformapagamento = $scope.formaspagamento[0]._id;
				
			}
		});
		
		
		
		
	}
	
	$scope.removerVacina = function(index){
		var vac  = $scope.modelObj.vacinas[index];
		//console.log(vac);
		$scope.modelObj.vacinas.splice(index,1);
		
		$scope.total = $scope.total-vac.valor_venda;
		//$scope.calculasaldo();
		$scope.calculasaldo();
		$scope.atualizarValores();
	}

	$scope.arrayformaspagamento = [];
	
	$scope.beforeCadastro = function() {
		
		

		$scope.paciente = '';
		$scope.pagamentos = [];
		$scope.medicos = BaseCtrl.getAll(Api.cadastros.medico);
		$scope.formaspagamento = BaseCtrl.getAll(Api.admconfs.formaspagamento);
		$scope.periodos = [
		{
			_id : 0,
			nome : ''
		},
		{
			_id : 10,
			nome : '10 dias'
		},
		{
			_id : 15,
			nome : '15 dias'
		},
		{
			_id : 20,
			nome : '20 dias'
		},
		{
			_id : 30,
			nome : '30 dias'
		},
		{
			_id : 45,
			nome : '45 dias'
		},
		{
			_id : 60,
			nome : '60 dias'
		},
		
		];


		if($location.search().cliente!=undefined){
			var cliente = $location.search().cliente;
			$scope.cliente = BaseCtrl.getAll(Api.cadastros.cliente,{_id : cliente},function(retorno){
					if(retorno.length > 0){
						$scope.modelObj.cliente = retorno[0]._id;
						$scope.modelObj.nomepacientepesquisa = retorno[0].nome;
						$scope.modelObj.medico = retorno[0].medico
					}
			});
		}else{
			if($scope.usuariologado[0].estrategia == 'localCliente'){
				$scope.modelObj.cliente = $scope.usuariologado[0].usuario._id;
				$scope.modelObj.nomepacientepesquisa = $scope.usuariologado[0].usuario.nome;
				$scope.modelObj.medico = $scope.usuariologado[0].usuario.medico
			}		
		}
				
	};

	$scope.atualizarValores =  function(ret){
		$scope.total = 0;
		if(ret == undefined || ret == ''){
			angular.forEach($scope.modelObj.vacinas,function(values, key){
				$scope.total+= values.valor;

			});
		}else{
			
			angular.forEach(ret.vacinas,function(values, key){
				$scope.total+= values.valor;
			});
		}
		$scope.calculasaldo();
		
	
	};

	$scope.afterCadastro = function(){
		
		if($scope.modelObj.cliente!=undefined){
			$scope.modelObj.nomepacientepesquisa = $scope.modelObj.cliente.nome;	
		}
		if($scope.modelObj.medico != undefined){
			$scope.modelObj.medico = $scope.modelObj.medico._id;	
		}
		
		
		$scope.atualizarValores();

		angular.forEach($scope.modelObj.pagamentos, function(value, key){
			$scope.pagamentos.push({
							formapagamento : value.formapagamento,
							valor : value.valor,
							data_pagamento : value.data_pagamento
			});
		});

		$scope.calculasaldo();
	}
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	
	
	if($scope.modelObj!=undefined){
		$scope.modelObj.vacinas = [];
		$scope.modelObj.pagamentos = [];
		$scope.pagamentos = [];
		$scope.modelObj.datavencimento = new Date();
		$scope.modelObj.qtdvacinapesquisa = 1;
	}
	
	
	
	$scope.data_vencimento = {};
	$scope.data_vencimento.opened = false;
	
	
	
	$scope.adicionarpagamento = function (){
		var formapagamento = $scope.modelObj.idformapagamento;
		var valor = $scope.modelObj.valorpgto;
		var dtpagamento = $scope.modelObj.datavencimento;
		if($scope.modelObj.periodo!=undefined){
			var dias = $scope.modelObj.periodo;
			var dtpagamento = new Date(dtpagamento);
	        dtpagamento.setUTCDate(dtpagamento.getDate() + dias);	
		}

		var qtdparcelas = $scope.modelObj.qtdparcela;

		if(qtdparcelas==undefined || qtdparcelas<=0){
			qtdparcelas  = 1;
		}
		
		var valordividido = valor / qtdparcelas;

		for (var i = 1; i <= qtdparcelas; i++) {
			if(valordividido <= $scope.saldo){
				$scope.modelObj.pagamentos.push({
					formapagamento : formapagamento,
					valor : valordividido,
					data_pagamento : dtpagamento
				});
				
				$scope.calculasaldo();
				
				angular.forEach($scope.formaspagamento,function(values, key){
					if(values._id == formapagamento){
						$scope.pagamentos.push({
							formapagamento : values,
							valor : valordividido,
							data_pagamento : dtpagamento
						});
					}
				});

				if($scope.modelObj.periodo!=undefined){
					var dias = $scope.modelObj.periodo;
					var dtpagamento = new Date(dtpagamento);
	            	dtpagamento.setUTCDate(dtpagamento.getDate() + dias);	
				}
				
            
				

			}	
		}
		

	}
	

	
	$scope.removerPagamento = function(index){
		$scope.modelObj.pagamentos.splice(index,1);
		$scope.pagamentos.splice(index,1);
		$scope.calculasaldo();

		
		//$scope.total = $scope.total-vac.valor_venda;
	}
	
	$scope.pagar = function(){
			var id = '5890e18e29d75f9818715526';
            $resource('/pagseguro/:id').get(
                {id : id},
                function(retorno) {
                    var code = retorno.checkout.code[0];
                    console.log(code);
                    PagSeguroLightbox({
                        code: code
                    }, {
                        success : function(transactionCode) {
						},
                        abort : function() {
                            //alert("abort");
                        }
                    });

                    console.log(retorno);
                },
                function(erro) {
                    $rootScope.mensagem = {
                        texto: 'Não existe.'
                    };

                }
            );


        };

	$scope.salvar = function(){
		var vai = true;
		$rootScope.mensagem = {};
		
		if(vai){
			if($scope.modelObj.cliente == '' || $scope.modelObj.cliente == undefined){
				$scope.mensagem = {
						erro: 'Selecione um cliente.'
				};
				vai = false;
			}
		}
		
		if(vai){
			if($scope.modelObj.vacinas.length <=0){
				$scope.mensagem = {
						erro: 'Selecione ao menos uma vacina.'
				};
				vai = false;
			}
		}
		if(vai){
			/*if($scope.saldo > 0){
				$scope.mensagem = {
						erro: 'Saldo maior que zero, informe o meio de pagamento.'
				};
				vai = false;
			}*/
		}
		
		
		if(vai){
			
			$scope.modelObj.$save()
			.then(
				function() {
					$scope.mensagem = {
						texto: 'Salvo com sucesso'
					};
					$state.go('atendimentos-compra-lista');
				}
			)
			.catch(
				function(erro) {
					$scope.mensagem = {
						erro: 'Não foi possível rejeitar'
					};
				}
			);
		}
	}
		

    $scope.atendimentos = BaseCtrl.getAll(Api.atendimentos.consulta,{naousardata : true});

	$scope.lista = function(searchParams){
		$scope.compras = [];
		
		if(searchParams!=undefined){
			
			var vai = true;

			if(searchParams.nome!=undefined && searchParams.nome!=''){
				vai = true;
			}
			
			if(searchParams.codigo!=undefined && searchParams.codigo!=''){
				vai = true;
			}
			//console.log(searchParams);

			if(vai){

				BaseCtrl.getAll(Api.estoque.saidas,searchParams,function(retorno){
					
					angular.forEach(retorno, function(value, key){
						angular.forEach($scope.atendimentos, function(valuea, keya){
							//console.log(valuea);
							if(valuea.saida._id == value._id){
								retorno[key].jatem = true;
								//console.log('ja tem um atendimento');
							}else{
								$scope.compras.push[value];
								//console.log(valuea.saida._id);
								//console.log(value._id);
							}
						});
						if(value.compra.pagamentos.length > 0 && value.compra.cliente!=undefined){
							if(value.compra.pagamentos[0].pagseguro!=undefined){
								
								if(value.compra.pagamentos[0].retorno == undefined || 
									value.compra.pagamentos[0].retorno.transaction.status[0] == 1
								){
									var transactionCode = value.compra.pagamentos[0].pagseguro;
									$resource('/pagseguro/transactions/:transactionCode').get(
						                {transactionCode : transactionCode},
						                function(retornoP) {
						                	value.compra.pagamentos[0].retorno = retornoP
						                	
						                	var model = new Api.atendimentos.compra();
						                	copia = angular.copy(value.compra);
						                	copia.cliente = copia.cliente._id;
						                	copia.pagamentos[0].formapagamento = value.compra.pagamentos[0].formapagamento._id; 
						                	delete copia.pagamentos[0].retorno.$promise;
						                	delete copia.pagamentos[0].retorno.$resolved;

						                	model = angular.merge(model,copia);
						                	//console.log(model);
						                	model.$save().then(function(retornosave) {
													console.log('salvou retorno do pagseguro '+value.codigo);
											});
						                	
						                },
						                function(erro) {
						                    $rootScope.mensagem = {
						                        texto: 'Não existe.'
						                    };
										}
					        		);	
								}

								
							}
						}
						

					});				
					



					$scope.compras = retorno;

				});	
			}
				
		}
			
	}	

	if($state.current.name == 'atendimentos-compra-lista'){
		$scope.lista({});
	}


});
