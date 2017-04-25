app.controller('AtendimentosCupomCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Campanhas'
		},
		resource: {
			name: 'cupom',
			desc: 'Cupons de Campanha'
		},
		states: {
			lista: {},
			cadastro: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "codcupom",
				desc: "Código Cupom"
			},
			{
				name: "codigo_cupom",
				desc: "Cod."
			},
			{
				name: "nome",
				desc: "Nome"
			},
			{
				name: "vacina", 
				subname : 'nome',
				desc: "Vacina"
			},
			{
				name: "valor_vacina", 
				desc: "Valor"
			},
			{
				name: "quantidade",
				desc: "Qtd"
			},
			{
				name: "quantidade_usuario",
				desc: "Qtd Pessoa"
			},
			{
				name: "data_validade",
				desc: "Dt Validade"
			}
			
		],
		fields: {
			nome: {}
		}
	};
	
	$scope.afterCadastro = function(){
		if($scope.modelObj.vacina!=undefined){
			$scope.modelObj.vacinanome = $scope.modelObj.vacina.nome;
			$scope.modelObj.vacina = $scope.modelObj.vacina._id;	
		}
		
	}

	$scope.buscavacina = function (){
		if($scope.modelObj.nomevacinapesquisa.length > 3){
			
			$scope.vacinas = BaseCtrl.getAll(Api.estoque.vacina,{pesquisaunica : $scope.modelObj.nomevacinapesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.vacinas = '';
				}
			});
		}else{
			$scope.vacinas = '';
		}
	}

	$scope.adicionarvacina = function(vacina){
		$scope.modelObj.vacina = vacina._id;
		$scope.modelObj.vacinanome = vacina.nome;
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
