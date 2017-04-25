app.controller('AtendimentosCupomCtrl', function($location, $rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, $resource, Api) {
	
	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Compras'
		},
		resource: {
			name: 'cupom',
			desc: 'Cupom'
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
	
	$scope.statecancela = 'atendimento-compracliente-lista';
	$scope.exibeactions = false;
	$scope.total = 0;
	
	
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
				}
			}else{
				$scope.mensagemcliente = 'Ops! Esta vacina não encontra-se em estoque.';
			}
		});
	}
	

	
	$scope.beforeCadastro = function() {
		$scope.libera = false;
		$scope.mensagemcliente = '';
	};


	$scope.optionsqtd = [];
	$scope.afterCadastro = function(){
		$scope.modelObj.cliente = $scope.usuariologado[0].usuario._id;
		$scope.modelObj.medico = $scope.usuariologado[0].usuario.medico
		$scope.modelObj.vacinas = [];

		
		var qtdmaximapessoas = $scope.modelObj.quantidade_usuario;
		var qtdmaximavendas = $scope.modelObj.quantidade;
		var qtdjavendidas = 0;
		var qtdjavendidasparaessecliente = 0
		$scope.qtdjavendidas = qtdjavendidasparaessecliente;

		var searchParams = {};
		searchParams.cupom =  $scope.modelObj._id;

		BaseCtrl.getAll(Api.atendimentos.compra,searchParams,function(comprascupom){
					if(comprascupom.length > 0){
						
						angular.forEach(comprascupom, function(value, key){
							angular.forEach(value.vacinas, function(vacina, key){
								if(vacina.vacina == $scope.modelObj.vacina._id){
									qtdjavendidas = qtdjavendidas + 1;
								}		
							});	

						});
						if(qtdjavendidas < qtdmaximavendas){
							searchParams.cliente = $scope.usuariologado[0].usuario._id;
							BaseCtrl.getAll(Api.atendimentos.compra,searchParams,function(compras){
								if(compras.length > 0){

									angular.forEach(compras, function(value, key){
										angular.forEach(value.vacinas, function(vacina, key){
											if(vacina.vacina == $scope.modelObj.vacina._id){
												qtdjavendidasparaessecliente = qtdjavendidasparaessecliente + 1;
											}		
										});
									});

									$scope.qtdjavendidas = qtdjavendidasparaessecliente;

									var qtdporusuario = $scope.modelObj.quantidade_usuario;
									qtdporusuarioatual = qtdporusuario - qtdjavendidasparaessecliente;
									for (var i = 1; i <= qtdporusuarioatual; i++) {
										$scope.optionsqtd.push({
											_id : i,
											nome : i 
										});
									}
									if(qtdporusuarioatual  <= 0){
										$scope.libera = false;
									}

									if(qtdjavendidasparaessecliente < qtdmaximapessoas){
										//segue
										$scope.libera = true;
									}else{
										$scope.mensagemcliente = 'Cliente atingiu o limite de compras para esse cupom';
									}

								}else{
									// segue
									$scope.libera = true;
									
								}	
							
								
							});	
						}else{
							$scope.mensagemcliente = 'O limite de compras para esse cupom foi atingido';
						}
						

					}else{
						//segue

						var qtdporusuario = $scope.modelObj.quantidade_usuario;
						qtdporusuarioatual = qtdporusuario - qtdjavendidasparaessecliente;
						for (var i = 1; i <= qtdporusuarioatual; i++) {
							$scope.optionsqtd.push({
								_id : i,
								nome : i 
							});
						}

						$scope.libera = true;
					}
			});			

		$scope.calculavalor();
		$scope.modelObj.qtdvacinapesquisa = 1;
	}
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	
	$scope.cadastro();

	$scope.calculavalor = function(){
		if($scope.modelObj.qtdvacinapesquisa == undefined){
			$scope.modelObj.qtdvacinapesquisa = 1;
		}
		$scope.modelObj.valorpgto = $scope.modelObj.qtdvacinapesquisa * $scope.modelObj.valor_vacina;
	}

	$scope.pagar = function(){
		var continua = true;
		var compra = new Api.atendimentos.compra();
		compra.vacinas = [];

		var qtd = $scope.modelObj.qtdvacinapesquisa;
		
		BaseCtrl.getAll(Api.estoque.lancamento,{vacina : $scope.modelObj.vacina._id},function(retorno){
			if(retorno.length > 0){
				for (var i = 1; i <=qtd; i++) {
					var vac = angular.copy($scope.modelObj.vacina);			
					var obj = {
							vacina : vac._id,
							valor : $scope.modelObj.valor_vacina,
							quantidade : 1,
							objvacina : vac
					}
					obj.lancamento = retorno[0];
					compra.vacinas.push(obj);
				}
				compra.cliente = $scope.modelObj.cliente;
				compra.valorpgto = $scope.modelObj.valorpgto;
				compra.cupom = $scope.modelObj._id;
				compra.pagamentos = [];
				$scope.compra = compra;
				
				if(continua){
					compra.$save()
						.then(function(retorno) {
							$rootScope.mensagem = {
								texto: 'Salvo com sucesso.'
							};
		
				            var id = retorno._id;
				            
				            $resource('/pagseguro/:id').get(
				                {id : id},
				                function(retorno) {
				                    var code = retorno.checkout.code[0];
				                    PagSeguroLightbox({
				                        code: code
				                    }, {
				                        success : function(transactionCode) {
				                        	
				                        	Api.atendimentos.compra.get({
												id: id
											},
											function(ret) {
												var compra = $scope.tratarRetornoBuscaParaEdicao(ret);

												
												

												BaseCtrl.getAll(Api.admconfs.formaspagamento, function(retorno){
													$scope.formaspagamento = retorno;

													angular.forEach(retorno, function(value, key){
														if(value.pagseguro!=undefined &&  value.pagseguro == true){
															
															compra.pagamentos.push({
																formapagamento : value._id,
																valor : $scope.modelObj.valorpgto,
																data_pagamento : new Date()
															});

															//$scope.adicionarpagamento();

															compra.pagamentos[0].pagseguro = transactionCode;



															compra.$save().then(function(retorno) {
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
				}else{
					
				}		


			}else{
				continua = false;
				$rootScope.mensagem = {
					texto: 'Lançamento não encontrado'
				};
			}
		});

		

			


        };



});
