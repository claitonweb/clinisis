app.controller('AtendimentosVisualizarCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Atendimentos'
		},
		resource: {
			name: 'consulta',
			desc: 'Consultas'
		},
		states: {
			//visualizar: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "cliente",
				desc: "Cliente",
				subname : 'nome'
			},
			{
				name: "medico",
				desc: "Médico",
				subname : 'nome'
			},
			{
				name: "usuario",
				desc: "Atendente",
				subname : 'nome'
			},
			{
				name: "data_atendimento",
				desc: "Dt Atendimento"
			},
			
		],
		fields: {
			nome: {}
		}
	};

	$scope.total = 0;
	$scope.saldo = 0;
	
	$scope.arrayformaspagamento = [];
	
	$scope.beforeCadastro = function() {
		$scope.paciente = '';
		$scope.medicos = BaseCtrl.getAll(Api.cadastros.medico);
		$scope.formaspagamento = BaseCtrl.getAll(Api.admconfs.formaspagamento);
	};
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	
	if ($stateParams.id) {
		$scope.modelService.get({
				id: $stateParams.id
			},
			function(ret) {
				$scope.modelObj = $scope.tratarRetornoBuscaParaEdicao(ret);
			},
			function(error) {
				$rootScope.mensagem = {
					texto: 'Não existe.'
				};
			}
		);
	} else {
		$scope.modelObj = new $scope.modelService();
	}
	
	if($scope.modelObj!=undefined){
		$scope.modelObj.vacinas = [];
		$scope.modelObj.pagamentos = [];
		$scope.pagamentos = [];
		$scope.modelObj.datavencimento = new Date();
	}
	
	
	$scope.data_vencimento = {};
	$scope.data_vencimento.opened = false;
	

	

});
