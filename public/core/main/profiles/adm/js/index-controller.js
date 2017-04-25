app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, filterFilter, Api) {

	var vm = $scope;
	$scope.id = $stateParams.id;

	$rootScope.mensagem = {
		texto: ''
	};
	

	//pega a situação de cadastro na ordem 1
	Api.admconfs.situacaocadastro.query({
			'ordem': '1'
		},
		function(status) {

			var queryObj = {
				status: {}
			};

			if (status[0] != undefined) {
				queryObj.status = status[0]._id;
			}

			Api.cadastros.cliente.query({}, //queryObj
				function(clientes) {
					$scope.clientes = clientes;
				},
				function(erro) {
					console.log(erro);
				}
			);
		},
		function(erro) {
			$rootScope.mensagem = {
				erro: 'Não foi possível obter a lista de Status.'
			};
		}
	);
});
