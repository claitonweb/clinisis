app.controller('AclUsuarioCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'acl',
			desc: 'Acl'
		},
		resource: {
			name: 'usuario',
			desc: 'Usuários'
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
				name: "username",
				desc: "Login/E-mail"
			},
			{
				name: "perfil",
				desc: "Perfil"
			},
			{
				name: "ativo",
				desc: "Ativo"
			}
		],
		fields: {
			nome: {}
		}
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);

	$scope.tratarRetornoBuscaParaEdicao = function(retorno){
		retorno.oldpassword = retorno.password;
		retorno.password = '';

		return retorno;
	};

	$scope.beforeCadastro = function() {
		$scope.perfis = BaseCtrl.getAll(Api.acl.perfil);
	};

	$scope.afterSalvar = function(){
		$scope.modelObj.password = '';
	};
});
