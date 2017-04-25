app.controller('FinanceiroPrevisaoAReceberCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.pesquisa = {};
	var d = new Date();
	var n = d.getMonth();
	var mes = n + 1;
	$scope.pesquisa.mes = mes.toString();

	$scope.meses = {
		1: 'Janeiro',
		2: 'Fevereiro',
		3: 'Março',
		4: 'Abril',
		5: 'Maio',
		6: 'Junho',
		7: 'Julho',
		8: 'Agosto',
		9: 'Setembro',
		10: 'Outubro',
		11: 'Novembro',
		12: 'Dezembro',
	}

	$scope.lista = function() {
		$scope.total = 0;
		$scope.objetolista = '';
		Api.financeiro.previsaoareceber.get($scope.pesquisa, function(retorno) {
			$scope.objetolista = retorno;
			console.log(retorno);
		}, function(erro) {
			console.log(erro);
		});
	}
});
