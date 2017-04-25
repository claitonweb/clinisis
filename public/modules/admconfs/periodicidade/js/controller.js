app.controller('AdmConfsPeriodicidadeCtrl', function($rootScope, $scope, $state, $stateParams, Api) {

	$scope.config = {
		module: {
			name: 'admconfs',
			desc: 'Configurações Administrativas'
		},
		resource: {
			name: 'periodicidade',
			desc: 'Periodicidades'
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
				name: "dias",
				desc: "Dias"
			}
		],
		fields: [
			{
				type: 'input',
				key: 'nome',
				templateOptions: {
					label: 'Nome',
					tye: 'text'
				}
			},
			{
				type: 'input',
				key: 'dias',
				templateOptions: {
					label: 'Dias',
					type: 'number'
				}
			}
		]
	};

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
