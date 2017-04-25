app.controller('CadastrosFornecedorCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'cadastros',
			desc: 'Cadastros'
		},
		resource: {
			name: 'fornecedor',
			desc: 'Fornecedores'
		},
		states: {
			lista: {},
			cadastro: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "cnpj", //|| pessoa.cnpj
				desc: "CNPJ"
			},
			{
				name: "razaosocial", // || pessoa.razaosocial
				desc: "Razão Social"
			},
			{
				name: "nome", // || pessoa.razaosocial
				desc: "Nome Fantasia"
			},
			{
				name: "telefone",
				desc: "Telefone"
				//ng-repeat="contato in cliente.pessoa.contato | limitTo:1"
			},
			{
				name: "email",
				desc: "E-mail"
				//ng-repeat="contato in cliente.pessoa.contato | limitTo:1"
			}
		],
		fields: {
			nome: {}
		}
	};
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
