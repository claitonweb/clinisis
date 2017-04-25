app.controller('FinanceiroVendasCtrl', function($location, $rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, $resource, Api) {
	
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
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);

    
	$scope.lista = function(searchParams){
		$scope.compras = [];
		$scope.searchParams = searchParams;

		if(searchParams!=undefined){
			
			var vai = true;

			if(searchParams.nome!=undefined && searchParams.nome!=''){
				vai = true;
			}
			
			if(searchParams.codigo!=undefined && searchParams.codigo!=''){
				vai = true;
			}

			if(searchParams.datainicio == undefined || searchParams.datafim == undefined){
				var dtinicio = new Date();
	            dtinicio.setHours(0,0,0,0);
	             
	            var dtfim = new Date();
	            dtfim.setHours(23,59,59,59);

	            searchParams.datainicio = dtinicio;
	            searchParams.datafim = dtfim;
			}

			if(vai){

				BaseCtrl.getAll(Api.atendimentos.compra,searchParams,function(retorno){
				//	console.log(retorno);
					angular.forEach(retorno, function(value, key){
						retorno[key].total = 0;

						angular.forEach(value.vacinas, function(vacina, keyvacina){
							retorno[key].total = retorno[key].total + vacina.valor;
						});

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
					
					$scope.total = 0;
					angular.forEach(retorno, function(value, key){
							$scope.total = $scope.total + value.total;
					});



					$scope.compras = retorno;

				});	
			}
				
		}
			
	}	
	
	$scope.lista({});
	

});
