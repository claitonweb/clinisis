app.controller('EstoqueSaidasCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'estoque',
			desc: 'Estoque'
		},
		resource: {
			name: 'saidas',
			desc: 'Saídas'
		},
		states: {
//			lista: {},
			cadastro: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "vacina",
				subname : 'nome',
				desc: "Vacina"
			},
			{
				name: "lote",
				desc: "Lote"
			},
			{
				name: "quantidade",
				desc: "Qtd"
			},
			{
				name: "quantidade_reserva",
				desc: "Qtd Res."
			},
			{
				name: "valor_compra",
				desc: "Valor"
			},
			{
				name: "fornecedor",
				subname : 'nome',
				desc: "Fornecedor"
			},
			{
				name: "data_compra",
				desc: "Dt Compra"
			},
			{
				name: "data_validade",
				desc: "Dt Valid."
			},
			{
				name: "data_lancamento",
				desc: "Dt Lanç."
			},
			{
				name: "usuario",
				subname : 'nome',
				desc: "Usuário"
			}
		],
		fields: {
			nome: {}
		}
	};

	$scope.totsaidas = {};
	
	$scope.lista = function(searchParams){
		BaseCtrl.getAll(Api.estoque.saidas,searchParams,function(retorno){
			$scope.saidas = retorno;
		});			
	}


	if($state.current.name == 'estoque-saidas-lista'){
		$scope.lista();
	}
	

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
});
