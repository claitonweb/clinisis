app.controller('AclPerfilCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'acl',
			desc: 'Acl'
		},
		resource: {
			name: 'perfil',
			desc: 'Perfis'
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
			}
		],
		fields: {
			nome: {}
		}
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);

	$scope.beforeCadastro = function() {
		$scope.recursos = BaseCtrl.getAll(Api.acl.resource);
	};
});
