app.controller('EstoqueLoteCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module : {
			name : 'estoque',
			desc : 'Estoque'
		},
		resource : {
			name : 'lote',
			desc : 'Lotes'
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
