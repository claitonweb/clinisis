app.controller('CadastrosMedicoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module : {
			name : 'cadastros',
			desc : 'Cadastros'
		},
		resource : {
			name : 'medico',
			desc : 'Médicos'
		},
		states : {
			lista : {},
			cadastro : {}
		},
		redirectSaveToState : "lista",
		listCols : [
			{
				name: "cpfcnpj", //|| pessoa.cnpj
				desc: "CPF"
			},
			{
				name: "nome", // || pessoa.razaosocial
				desc: "Nome"
			},
			{
				name: "especialidade", // || pessoa.razaosocial
				desc: "Especialidade",
				subname : 'nome'
			},
			{
				name: "crm", // || pessoa.razaosocial
				desc: "CRM"
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
			/*{
				name: "status.nome",
				desc: "Situação"
				//style="background: {{cliente.status.cor}};text-align: center;"
			}*/
		],
		fields : {
			nome : {}
		}
	}

	$scope.beforeCadastro = function(){
		$scope.especialidades = BaseCtrl.getAll(Api.admconfs.especialidade);
	};

	$scope.preparar = function(){
		if($scope.modelObj!=undefined){
			$scope.modelObj.dtnascimento = new Date($scope.modelObj.dtnascimento);	
		}
	}

	
	$scope.$watch('modelObj', $scope.preparar);
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
