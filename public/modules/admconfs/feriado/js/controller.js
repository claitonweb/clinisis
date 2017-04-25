app.controller('AdmConfsFeriadoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'admconfs',
			desc: 'Configurações Administrativas'
		},
		resource: {
			name: 'feriado',
			desc: 'Feriados'
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
				name: "dia",
				desc: "Dia"
			},
			{
				name: "mes",
				desc: "Mês"
			},
			{
				name: "ano",
				desc: "Ano"
			}
		],
		fields: {
			codigo: {},
			nome: {}
		}
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
