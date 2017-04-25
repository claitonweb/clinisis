app.controller('InventarioCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'estoque',
			desc: 'Estoque'
		},
		resource: {
			name: 'saidas',
			desc: 'Inventário'
		},
		states: {
//			lista: {},
			cadastro: {}
		},
		redirectSaveToState: "lista",
		fields: {
			nome: {}
		}
	};
	
	$scope.listadestatus = [];
	$scope.listadestatus.push({'nome' : 'Baixa','codigo' : 'B'});
	$scope.listadestatus.push({'nome' : 'Reserva/Paga', 'codigo' : 'RP'});
	$scope.listadestatus.push({'nome' : 'Reserva/Não Paga', 'codigo' : 'RNP'});
	

	
	$scope.totsaidas = {};


	$scope.lista = function(searchParams){
		$scope.totsaidas = {};
		var cont = 0;
		var total = 0;
		var vacinaatual = '';
		BaseCtrl.getAll(Api.estoque.lancamento,{},function(retornoentrada){
			
			total = retornoentrada.length;
			var totalQtd = 0;
			angular.forEach(retornoentrada, function(valuee, keye){
				
				var vacina = valuee.vacina.nome;
				var idvacina = valuee.vacina._id;
				var lote = valuee.lote;

				if($scope.totsaidas[vacina] == undefined){
					$scope.totsaidas[vacina] = {};
					$scope.totsaidas[vacina]['entradas'] = 0;
					$scope.totsaidas[vacina]['id'] = idvacina;
				}


				angular.forEach($scope.totsaidas, function(value, key){
					if(key == vacina){
						$scope.totsaidas[key]['entradas'] += parseInt(valuee.quantidade);
					}
				});

				cont++;
				if(cont == total){
					totalQtd = 0;
					
					calcula(searchParams);
				}

			});
		});
	}

	function calcula(searchParams){
		angular.forEach($scope.totsaidas, function(value, key){
			var vacina = key;
			BaseCtrl.getAll(Api.estoque.saidas,{idvacina : value.id},function(retorno){
				angular.forEach(retorno, function(value, key){
						var status = value.status;
						
						if($scope.totsaidas[vacina][status] == undefined){
							$scope.totsaidas[vacina][status] = {};	
						}

						if($scope.totsaidas[vacina][status]['total'] == undefined){
							$scope.totsaidas[vacina][status]['total'] = 1;	
						}else{
							$scope.totsaidas[vacina][status].total = $scope.totsaidas[vacina][status].total + 1;
						}
					});

			});
		});
	}

	if($state.current.name == 'estoque-inventario'){
		$scope.lista();
	}
	

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
