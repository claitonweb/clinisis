app.controller('FinanceiroContaAPagarCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'financeiro',
			desc: 'Financeiro'
		},
		resource: {
			name: 'contaapagar',
			desc: 'Contas A Pagar'
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
				name: "centrodecusto",
				desc: "Centro de C.",
				subname : "nome"
			},
			{
				name: "contacontabil",
				desc: "C. Contábil",
				subname : "nome"
			},
			{
				name: "aliquota",
				desc: "Alíquota"
			}
		],
		fields: {
			nome: {}
		}
	}

	$scope.beforeCadastro = function(){
		$scope.periodicidades	= BaseCtrl.getAll(Api.admconfs.periodicidade);
		$scope.fornecedores		= BaseCtrl.getAll(Api.cadastros.fornecedor);
		$scope.centrosdecusto	= BaseCtrl.getAll(Api.financeiro.centrocusto);
		$scope.contascontabeis	= BaseCtrl.getAll(Api.financeiro.contacontabil);
	};

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
