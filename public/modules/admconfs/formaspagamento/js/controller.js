app.controller('AdmConfsFormasPagamentoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'admconfs',
			desc: 'AdmConfs'
		},
		resource: {
			name: 'formaspagamento',
			desc: 'Formas de Pagamento'
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
	};

	$scope.beforeCadastro = function() {
		//$scope.bancos = BaseCtrl.getAll(Api.admconfs.banco);
	};

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
