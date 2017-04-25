app.controller('AtendimentosCompraExternaCtrl', function($location, $rootScope, $scope, $routeParams, 
	$stateParams, $state, $filter, $window, $resource, Api, Notification) {
	
	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Atendimentos'
		},
		resource: {
			name: 'compra',
			desc: 'Compra Externa'
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
	
	
	
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	
	
    $scope.maximo = 10;
    $scope.load = function(){
    	if($scope.compras != undefined){
    		
    		Notification({message: 'Carregando',replaceMessage: true, positionY: 'bottom', positionX: 'left'}, 'info');
    		
    		var total = $scope.compras.length;
	    	if($scope.maximo < total){
	    		var soma = 0;
				var maximo = angular.copy($scope.maximo);
	    		
	    		for(var i = 0; i < 10; i++) {
	    			soma = soma + 1;
	    			if((maximo + soma) >= total){
	    				break;
	    			}
	    		}
	    		

	    		$scope.maximo = $scope.maximo + soma;	
	    	}	
    	}
    }

	$scope.lista = function(searchParams){
		var compras = [];
		
		if(searchParams!=undefined){
			
			Notification({message: 'Carregando',delay : 500000 ,replaceMessage: true, positionY: 'bottom', positionX: 'left'}, 'info');
		
			$scope.searchParams = angular.copy(searchParams);
			var vai = true;
			var statuspgto = false;

			if(searchParams.nome!=undefined && searchParams.nome!=''){
				vai = true;
			}
			
			if(searchParams.codigo!=undefined && searchParams.codigo!=''){
				vai = true;
			}

			if(searchParams.status!=undefined && searchParams.status!=''){
				statuspgto = searchParams.status;
				delete searchParams.status;
			}

			searchParams.externa = 1;
			//console.log(searchParams);

			if(vai){

				BaseCtrl.getAll(Api.atendimentos.consulta,{naousardata : true}, function(atendimentos){
					BaseCtrl.getAll(Api.estoque.saidas,searchParams,function(retorno){
					
					$scope.compras = retorno;
					if(retorno.length < $scope.maximo){
						$scope.maximo = retorno.length;
					}
					angular.forEach(retorno, function(value, key){


						if(value.compra!=undefined && value.compra.cupom){
							Api.atendimentos.cupom.get({id : value.compra.cupom},function(cupom){
								//console.log(cupom);
								if(retorno[key]!=undefined && retorno[key].compra!=undefined){
									retorno[key].compra.cupom = cupom;	
								}
								
							})
						}

						//$scope.atendimentos = BaseCtrl.getAll(Api.atendimentos.consulta,{naousardata : true});

						if(value.compra!=undefined && value.compra.pagamentos.length > 0 && value.compra.cliente!=undefined){
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
													console.log('salvou retorno do pagseguro ', retornosave);

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

						angular.forEach(atendimentos, function(valuea, keya){
							//console.log(valuea);
							if(valuea.saida!=undefined){
								if(valuea.saida._id == value._id){
									retorno[key].jatem = true;
									retorno[key].atendimento = valuea;
								}else{
									
								}	
							}
						});

						
						
						if(statuspgto){
								if(statuspgto == 3){ //pago 
									if(value.compra.pagamentos.length <= 0 || value.compra.pagamentos == undefined){
										retorno[key].compra = undefined;
										//retorno.splice(5,1);
									}else{
										if(value.compra.pagamentos[0].retorno!=undefined){
											if(value.compra.pagamentos[0].retorno.transaction.status[0] != 3){
												retorno[key].compra = undefined;
											}
										}
									}
								}
									
								if(statuspgto == 1){ //aguardando
									
									if(value.compra.pagamentos.length > 0 || value.compra.pagamentos == undefined){
										if(value.compra.pagamentos[0].retorno!=undefined){
											if(value.compra.pagamentos[0].retorno.transaction.status[0] != 1){
												retorno[key].compra = undefined;
											}
										}else{
											retorno[key].compra = undefined;
										}	
									}
								}
						}
						//console.log('adicionar', value);
						//compras.push[value];
						
						//console.log($scope.compras);
						
						Notification.clearAll();

					});				
					

					//console.log($scope.compras);

					

				});	
			});
				
		}
				
	}
			
	}	

	if($state.current.name == 'atendimentos-compra-externa-lista'){
		$scope.lista({});
	}


});
