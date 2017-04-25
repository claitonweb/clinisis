app.controller('FinanceiroContaContabilCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'financeiro',
			desc: 'Financeiro'
		},
		resource: {
			name: 'contacontabil',
			desc: 'Contas Contabeis'
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
				name: "pai",
				desc: "Conta Pai"
			}
		],
		fields: {
			nome: {}
		}
	};

	$scope.beforeCadastro = function(){
		$scope.contascontabeis	= BaseCtrl.getAll(Api.financeiro.contacontabil);
	};

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
