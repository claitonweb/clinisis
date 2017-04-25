app.controller('FinanceiroCentroCustoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'financeiro',
			desc: 'Financeiro'
		},
		resource: {
			name: 'centrocusto',
			desc: 'Centros de Custos'
		},
		states: {
			lista: {},
			cadastro: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "nome",
				desc: "Nome"
			},
			{
				name: "codigo",
				desc: "Código"
			}
		],
		fields: {
			nome: {}
		}
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
