app.controller('mainCtrl', ['$rootScope', '$scope', '$state', '$resource', '$window', function($scope, $state, $rootScope, $resource, $window) {

	$scope.buscacepCorreios = function() {
		window.open('http://www.buscacep.correios.com.br/servicos/dnec/index.do');
	}
	$scope.buscaCnpjReceita = function() {
		window.open('http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/Cnpjreva_Solicitacao.asp');
	}

	$scope.clienteexterno = true;

	$scope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams) {
			$scope.mensagem = '';
			$scope.clienteexterno = true;
		});
}]);
