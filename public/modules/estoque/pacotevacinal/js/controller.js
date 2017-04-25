app.controller('EstoquePacoteVacinalCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {
//console.log($state.get());
	$scope.config = {
		module : {
			name : 'estoque',
			desc : 'Estoque'
		},
		resource : {
			name : 'pacotevacinal',
			desc : 'Pacotes Vacinais'
		},
		states : {
			lista : {},
			cadastro : {}
		},
		redirectSaveToState : "lista",
		listCols : [
			{
				name: "nome",
				desc: "Nome"
			},
			{
				name: "codigo",
				desc: "Código"
			}
		],
		fields : {
			nome : {}
		}
	}
	
	$scope.vacinas = BaseCtrl.getAll(Api.estoque.vacina, function(retorno){
	
	});

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
