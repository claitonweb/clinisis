app.controller('AdmConfsSituacaoCadastroCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module : {
			name : 'admconfs',
			desc : 'Configurações Administrativas'
		},
		resource : {
			name : 'situacaocadastro',
			desc : 'Situaçôes de Cadastro'
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
			},
			{
				name: "ordem",
				desc: "Ordem"
			},
			{
				name: "cor",
				desc: "Cor"
			}
		],
		fields : {
			nome : {}
		}
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
