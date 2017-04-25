app.controller('EstoqueVacinaCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'estoque',
			desc: 'Estoque'
		},
		resource: {
			name: 'vacina',
			desc: 'Vacinas'
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
			},
			{
				name: "valor_venda",
				desc: "Valor"
			},
			{
				name: "online",
				desc: "Venda Online"
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
