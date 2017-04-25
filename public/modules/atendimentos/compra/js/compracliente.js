app.controller('AtendimentosCompraClienteCtrl', function($location, $rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, $resource, Api) {
	
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
			//lista: {},
			cadastro: {},
			//visualizar: {}
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
		var nomepesquisa = '';
		if($scope.modelObj!=undefined){
			nomepesquisa = $scope.modelObj.nomevacinapesquisa;
		}
		//if($scope.modelObj.nomevacinapesquisa.length > 3){
			$scope.vacinas = [];

			BaseCtrl.getAll(
				Api.estoque.vacina,{pesquisaunica : nomepesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.vacinas = '';
				}else{
					angular.forEach(retorno, function(value, key){
					 if(value.online == true){
						$scope.vacinas.push(value);
					 }
					});
				}
			});




		/*}else{
			$scope.vacinas = '';
		}*/
	}

	
	$scope.buscapacote = function (){
		
		var nomepesquisa = '';
		if($scope.modelObj!=undefined){
			nomepesquisa = $scope.modelObj.nomepacotepesquisa;
		}

		//if($scope.modelObj.nomepacotepesquisa.length > 3){
			
			$scope.pacotes = BaseCtrl.getAll(Api.estoque.pacotevacinal,{pesquisaunica : nomepesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.pacotes = '';
				}
			});
		/*}else{
			$scope.pacotes = '';
		}*/
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

				//$scope.modelObj.idformapagamento = $scope.formaspagamento[0]._id;
			}else{
				$scope.mensagem = {
					erro : 'Ops! Esta vacina não encontra-se em estoque.'
				};
			}
		});
		
		
		
		
	}
	
	$scope.removerVacina = function(index){
		var vac  = $scope.modelObj.vacinas[index];
		
		$scope.modelObj.vacinas.splice(index,1);
		
		$scope.total = $scope.total-vac.valor_venda;
		//$scope.calculasaldo();
		$scope.calculasaldo();
		$scope.atualizarValores();
	}

	$scope.arrayformaspagamento = [];
	
	$scope.beforeCadastro = function() {
		
		$scope.buscavacina();
		$scope.buscapacote();

		$scope.paciente = '';
		$scope.pagamentos = [];
		$scope.medicos = BaseCtrl.getAll(Api.cadastros.medico);
		//$scope.formaspagamento = BaseCtrl.getAll(Api.admconfs.formaspagamento);

		

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


		if($stateParams.id == undefined || $stateParams.id == ''){
			$scope.modelObj.vacinas = [];
			$scope.modelObj.pagamentos = [];
			$scope.pagamentos = [];
			$scope.modelObj.datavencimento = new Date();
			$scope.modelObj.qtdvacinapesquisa = 1;
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
		$scope.modelObj.cliente = $scope.usuariologado[0].usuario._id;

		$scope.modelObj.qtdvacinapesquisa = 1;

		$scope.modelObj.nomepacientepesquisa = $scope.modelObj.cliente.nome;
		
	

		if($scope.modelObj.medico!=undefined){
			$scope.modelObj.medico = $scope.modelObj.medico._id;	
		}
		
		
		$scope.atualizarValores();





		angular.forEach($scope.modelObj.pagamentos, function(value, key){
			if(value.pagseguro!=undefined){
				var transactionCode = value.pagseguro;
				$resource('/pagseguro/transactions/:transactionCode').get(
					                {transactionCode : transactionCode},
					                function(retornoP) {
					                	value.retorno = retornoP
					                },
					                function(erro) {
					                    $rootScope.mensagem = {
					                        texto: 'Não existe.'
					                    };
									}
				        		);
			}
			$scope.pagamentos.push({
							formapagamento : value.formapagamento,
							valor : value.valor,
							data_pagamento : value.data_pagamento
			});
		});

		$scope.calculasaldo();

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
		
	
	}
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	
	
	/*if($scope.modelObj!=undefined){
		$scope.modelObj.vacinas = [];
		$scope.modelObj.pagamentos = [];
		$scope.pagamentos = [];
		$scope.modelObj.datavencimento = new Date();
		$scope.modelObj.qtdvacinapesquisa = 1;
	}*/
	
	
	
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

	$scope.exibeactions = false;
	
	$scope.pagar = function(){
		
			$scope.modelObj.$save()
						.then(function(retorno) {
							$rootScope.mensagem = {
								texto: 'Salvo com sucesso.'
							};
		
							var id = '5890e18e29d75f9818715526';
				            var id = retorno._id;
				            
				            $resource('/pagseguro/:id').get(
				                {id : id},
				                function(retorno) {
				                    var code = retorno.checkout.code[0];
				                    PagSeguroLightbox({
				                        code: code
				                    }, {
				                        success : function(transactionCode) {
				                        	
				                        	$scope.modelService.get({
												id: id
											},
											function(ret) {
												$scope.modelObj = $scope.tratarRetornoBuscaParaEdicao(ret);

												
												

												BaseCtrl.getAll(Api.admconfs.formaspagamento, function(retorno){
													$scope.formaspagamento = retorno;

													angular.forEach(retorno, function(value, key){
														if(value.pagseguro!=undefined &&  value.pagseguro == true){
															$scope.modelObj.idformapagamento = value._id;
															$scope.modelObj.valorpgto = $scope.total;
															$scope.modelObj.datavencimento = new Date();
															$scope.adicionarpagamento();

															$scope.modelObj.pagamentos[0].pagseguro = transactionCode;



															$scope.modelObj.$save().then(function(retorno) {
																//$state.go('atendimento-compracliente-cadastro',{id : id});
																$state.go('atendimento-compracliente-sucesso');
															});
															
														}
													});	
												});	

												
											},
											function(error) {
												$rootScope.mensagem = {
													texto: 'Não existe.'
												};
											}
										);

				                        	//console.log(transactionCode);
				                        	
				                        	//$state.go('atendimento-compracliente-cadastro',{id : id});	
										},
				                        abort : function() {
				                        	if($stateParams.id!=undefined){
				                        		document.location.reload();
				                        	}else{
				                        		$state.go('atendimento-compracliente-cadastro',{id : id});	
				                        	}
				                            
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

							
						})
						.catch(function(error) {
							var errorMsg = 'Não foi possível salvar';
							$rootScope.mensagem = {
								texto: errorMsg
							};
						});


			


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
		

    $scope.atendimentos = BaseCtrl.getAll(Api.atendimentos.consulta,{});

	
	$scope.lista = function(searchParams){
		$scope.compras = [];
		
		if(searchParams!=undefined){
			
			var vai = true;

			if(searchParams.nome!=undefined && searchParams.nome!=''){
				vai = true;
			}
			
			if(searchParams.codigo!=undefined && searchParams.codigo!=''){
				vai = true;
			}else{
				if($scope.usuariologado[0].estrategia == 'localCliente'){
					searchParams.cliente = $scope.usuariologado[0].usuario._id;
					vai = true;
				}	
			}
			

			if(vai){

				BaseCtrl.getAll(Api.atendimentos.compra,searchParams,function(retorno){
				//	console.log(retorno);
					angular.forEach(retorno, function(value, key){
						if(value.pagamentos.length > 0){
							if(value.pagamentos[0].pagseguro!=undefined){
								var transactionCode = value.pagamentos[0].pagseguro;
								
								if(value.pagamentos[0].retorno == undefined || 
									value.pagamentos[0].retorno.transaction.status[0] == 1
								){
									$resource('/pagseguro/transactions/:transactionCode').get(
						                {transactionCode : transactionCode},
						                function(retornoP) {
						                	value.pagamentos[0].retorno = retornoP
						                	
						                	var copia = angular.copy(value);
						                	//precisa pra atualizar o estoque
						                	copia.$save().then(function(retornosave) {
												console.log('salvou retorno do pagseguro '+value.codigo);
											});

											BaseCtrl.getAll(Api.atendimentos.compra,searchParams,function(retorno){

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

	if($state.current.name == 'atendimento-compracliente-lista'){
		$scope.lista({});
	}


});
