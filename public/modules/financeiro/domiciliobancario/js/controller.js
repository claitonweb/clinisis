app.controller('FinanceiroDomicilioBancarioCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, Api) {

	$scope.config = {
		module: {
			name: 'financeiro',
			desc: 'Financeiro'
		},
		resource: {
			name: 'domiciliobancario',
			desc: 'Domicílios Bancários'
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
				name: "banco",
				subname: 'nome',
				desc: "Banco"
			},
			{
				name: "agencia",
				subname: 'nome',
				desc: "Agência"
			},
			{
				name: "conta",
				desc: "Conta"
			},
			{
				name: "digitoconta",
				desc: "Digito"
			}
		],
		fields: {
			nome: {}
		}
	}

	$scope.beforeCadastro = function(){
		$scope.bancos = BaseCtrl.getAll(Api.admconfs.banco);
		$scope.buscaragencias();
	};

	$scope.tratarRetornoBuscaParaEdicao = function(retorno){
		$scope.buscaragencias();

		return retorno;
	};

	$scope.buscaragencias = function() {
		if($scope.modelObj != undefined){
			if ($scope.modelObj.banco != undefined) {
				Api.admconfs.agencia.query({
					banco: $scope.modelObj.banco
				},
				function(retorno) {
					$scope.agencias = retorno;
					if (retorno.length > 0) {
						$scope.modelObj.agencia = retorno[0]._id;
					}

				},
				function(erro) {
					console.log("Não foi possível obter a lista de contatos");
					console.log(erro);
				});
			}
		}
	};

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
