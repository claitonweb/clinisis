app.controller('AdmConfsBancoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module : {
			name : 'admconfs',
			desc : 'Configurações Administrativas'
		},
		resource : {
			name : 'banco',
			desc : 'Banco'
		},
		states : {
			lista : {},
			cadastro : {}
		},
		redirectSaveToState : "lista",
		listCols : [
			{
				name: "nome",
				desc: "Nome"
			},
			{
				name: "codigo",
				desc: "Código"
			}
		],
		fields : {
			nome : {}
		}
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
