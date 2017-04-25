app.controller('FinanceiroContaAReceberCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'financeiro',
			desc: 'Financeiro'
		},
		resource: {
			name: 'contaareceber',
			desc: 'Contas A Receber'
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
				name: "data_vencimento",
				desc: "Dt. Venci."
			}
		],
		fields: {
			nome: {}
		}
	}

	$scope.beforeCadastro = function(){
		$scope.periodicidades	= BaseCtrl.getAll(Api.admconfs.periodicidade);
		$scope.centrosdecusto	= BaseCtrl.getAll(Api.financeiro.centrocusto);
		$scope.contascontabeis	= BaseCtrl.getAll(Api.financeiro.contacontabil);
	};

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
