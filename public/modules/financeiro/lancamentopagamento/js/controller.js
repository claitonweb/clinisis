app.controller('FinanceiroLancamentoPagamentoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'financeiro',
			desc: 'Financeiro'
		},
		resource: {
			name: 'lancamentopagamento',
			desc: 'Lançamentos de Pagamento'
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
				name: "valor",
				desc: "Valor"
			},
			{
				name: "numeronota",
				desc: "Nota"
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
				name: "data_vencimento",
				desc: "Vencimento"
			},
			{
				name: "data_pagamento",
				desc: "Pagamento"
			}
		],
		fields: {
			nome: {}
		}
	}


	$scope.beforeCadastro = function() {
		$scope.contasapagar		= BaseCtrl.getAll(Api.financeiro.contaapagar,function(retorno){
			var array = [];
			angular.forEach($scope.contasapagar, function(value, key){
				if(value.imposto == true){
					array.push(value);	
				}
			});
			
			$scope.impostos = array;
		});
		///$scope.impostos			= BaseCtrl.getAll(Api.financeiro.contaapagar, { imposto: 1 });
		
		$scope.domicilios		= BaseCtrl.getAll(Api.financeiro.domiciliobancario);
		$scope.centrosdecusto	= BaseCtrl.getAll(Api.financeiro.centrocusto);
	}

	$scope.copiavalororiginal = function() {
		$scope.valororiginal = angular.copy($scope.modelObj.valor);
	}

	$scope.selecionaconta = function() {
		$scope.modelObj.centrodecusto = '';
		$scope.modelObj.data_vencimento = '';
		$scope.valororiginal = angular.copy($scope.modelObj.valor);
		var contaapagar = $scope.modelObj.contaapagar;
		angular.forEach($scope.contasapagar, function(value, key) {
			if (value._id == contaapagar) {
				console.log(value);
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

	$scope.selecionaimposto = function() {

		var impostosselecionados	= $scope.modelObj.impostos;
		//console.log(impostosselecionados);
		var valorConta				= $scope.modelObj.valor;
		var valorDoImpostoAtual		= $scope.modelObj.valorimposto;
		$scope.modelObj.valor			= $scope.valororiginal;


		if (valorConta > 0) {
			//console.log($scope.impostos);
			angular.forEach(impostosselecionados, function(valueImposto, keyImposto) {
				angular.forEach($scope.impostos, function(value, key) {
					
					if (value._id == valueImposto) {
						valorDoImpostoAtual			= $scope.modelObj.valorimposto;
						console.log(valorDoImpostoAtual);
						valorConta					= $scope.modelObj.valor;
						console.log(valorConta);
						var percent					= value.aliquota;
						console.log(percent);
						var valorDoImposto			= (percent * (valorConta / 100));
						console.log(valorDoImposto);
						var valorComImposto			= valorConta + valorDoImposto;
						console.log(valorComImposto);
						$scope.modelObj.valor			= valorComImposto;
						$scope.modelObj.valorimposto	= valorDoImposto;
					}
				});
			});
		}

		if (impostosselecionados.length == 0) {
			$scope.modelObj.valorimposto = '';
		}
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
