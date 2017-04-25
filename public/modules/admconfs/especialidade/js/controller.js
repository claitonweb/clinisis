app.controller('AdmConfsEspecialidadeCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module : {
			name : 'admconfs',
			desc : 'Configurações Administrativas'
		},
		resource : {
			name : 'especialidade',
			desc : 'Especialidades Médicas'
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
