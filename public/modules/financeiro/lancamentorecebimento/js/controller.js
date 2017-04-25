app.controller('FinanceiroLancamentoRecebimentoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'financeiro',
			desc: 'Financeiro'
		},
		resource: {
			name: 'lancamentorecebimento',
			desc: 'Lançamentos de Recebimento'
		},
		states: {
			lista: {},
			cadastro: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "contaareceber",
				subname : 'nome',
				desc: "Conta"
			},
			{
				name: "valor", // | currency
				desc: "Valor"
			},
			{
				name: "centrodecusto",
				subname : 'nome',
				desc: "Centro de C."
			},
			{
				name: "domiciliobancario",
				subname : 'nome',
				desc: "Domicílio B."
			},
			{
				name: "data_vencimento", // | date : 'dd/MM/yyyy'
				desc: "Vencimento"
			},
			{
				name: "data_pagamento", // | date : 'dd/MM/yyyy'
				desc: "Pagamento"
			}
		],
		fields: {
			nome: {}
		}
	}

	$scope.beforeCadastro = function() {
		$scope.contasareceber	= BaseCtrl.getAll(Api.financeiro.contaareceber);
		//$scope.clientes			= [];//BaseCtrl.getAll(Api.cadastros.cliente);
		$scope.clientes			= BaseCtrl.getAll(Api.cadastros.cliente);
		$scope.domicilios		= BaseCtrl.getAll(Api.financeiro.domiciliobancario);
		$scope.centrosdecusto	= BaseCtrl.getAll(Api.financeiro.centrocusto);

		
	}

	$scope.copiavalororiginal = function() {
		$scope.valororiginal = angular.copy($scope.modelObj.valor);
	}

	$scope.selecionaconta = function() {
		$scope.modelObj.centrodecusto		= '';
		$scope.modelObj.datavencimento	= '';
		$scope.valororiginal				= angular.copy($scope.modelObj.valor);
		var contaareceber					= $scope.modelObj.contaareceber;

		angular.forEach($scope.contasareceber, function(value, key) {
			if (value._id == contaareceber) {

				$scope.conta = value;
				$scope.modelObj.centrodecusto = value.centrodecusto;
				if (value.valor != undefined) {
					$scope.valororiginal = angular.copy(value.valor);
				}

				if (value.tipo == 'p') {
					$scope.modelObj.data_vencimento = new Date(value.data_vencimento);
				}

				if (value.tipo == 'f') {
					//calcular a data de vencimento
				}
			}
		});
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
