app.controller('FinanceiroCaixaCtrl', function($location, $rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {
	
	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Financeiro'
		},
		resource: {
			name: 'compra',
			desc: 'Caixa'
		},
		states: {
			lista: {},
			cadastro: {},
			visualizar: {}
		},
		redirectSaveToState: "lista",
		fields: {
			nome: {}
		}
	};
	
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	
	
	

	$scope.lista = function(searchParams){
		$scope.compras = [];
		var comprasquejatem = [];
		$scope.searchParams = angular.copy(searchParams);
		if(searchParams!=undefined){
			
			var vai = true;
			var somentedodia = true;

			var datainicio = angular.copy(searchParams.datainicio);
			var datafim =  angular.copy(searchParams.datafim);

			delete searchParams.datainicio;
			delete searchParams.datafim;

			/*if(searchParams.somentedodia == undefined){
				searchParams.somentedodia = "true";
				$scope.searchParams.somentedodia = "true";
			}

			if(searchParams.somentedodia == "false"){
				somentedodia = false;
			}

			console.log(somentedodia, searchParams.somentedodia);

			$scope.somentedodia = somentedodia;
			delete searchParams.somentedodia;
			*/
			if(searchParams.nome!=undefined && searchParams.nome!=''){
				vai = true;
			}
			
			if(searchParams.codigo!=undefined && searchParams.codigo!=''){
				vai = true;
			}
			

			if(vai){
				$scope.total = 0;
				BaseCtrl.getAll(Api.estoque.saidas,searchParams,function(retorno){
					
					angular.forEach(retorno, function(value, key){
						//angular.forEach(value.compra, function(value2, key2){
							//if(value2!=null){

								//if(value2.pagamentos!=undefined){
							if(comprasquejatem.indexOf(value.compra._id)<0){
								comprasquejatem.push(value.compra._id);	
								
								if(value.compra!=undefined && value.compra.pagamentos!=undefined){
									//angular.forEach(value2.pagamentos, function(pagamento, key3){
									angular.forEach(value.compra.pagamentos, function(pagamento, key3){
										//console.log(pagamento);
										pagamento.compra = angular.copy(value.compra);
										
										var dthoje = new Date();
										dthoje = dthoje.getUTCDate() + '/' + (dthoje.getUTCMonth()+1) + '/'+ dthoje.getUTCFullYear();
										
										var dtpgto = new Date(pagamento.data_pagamento);
										dtpgto = dtpgto.getDate() + '/' + (dtpgto.getUTCMonth()+1) + '/'+ dtpgto.getUTCFullYear();
										
										
										if(datainicio!=undefined && datafim!=undefined){
											datainicio2 = new Date(datainicio);
											datainicio2 = datainicio2.getUTCDate() + '/' + (datainicio2.getUTCMonth()+1) + '/'+ datainicio2.getUTCFullYear();

											datafim2 = new Date(datafim);
											datafim2 = datafim2.getUTCDate() + '/' + (datafim2.getUTCMonth()+1) + '/'+ datafim2.getUTCFullYear();

											//console.log(dtpgto,datafim);
											//console.log(dtpgto,datainicio2);

											if(dtpgto <= datafim2 && dtpgto>=datainicio2){
												$scope.compras.push(pagamento);
												$scope.total += pagamento.valor;
											}
										}else{
											if(dtpgto == dthoje){
												$scope.compras.push(pagamento);
												$scope.total += pagamento.valor;
											}	
										}
										//console.log(pagamento);

										/*if(somentedodia == true){
											if(dtpgto == dthoje){
												$scope.compras.push(pagamento);
												$scope.total += pagamento.valor;
											}	
										}else{
											
										}*/
										
										//$scope.compras.push(pagamento);
										//$scope.total += pagamento.valor;
										

										
									});	
								}
							}else{
								console.log('ja tem');
							}
							//}
														
						//});
					});

					//$scope.compras = retorno;

				});	
			}
				
		}
			
	}	

	if($state.current.name == 'financeiro-caixa-lista'){
		$scope.lista({});
	}


});
