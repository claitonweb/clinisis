app.controller('AclResourceCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'acl',
			desc: 'Acl'
		},
		resource: {
			name: 'resource',
			desc: 'Resources'
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
				name: "state",
				desc: "State"
			}
		],
		fields: {
			nome: {}
		}
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
