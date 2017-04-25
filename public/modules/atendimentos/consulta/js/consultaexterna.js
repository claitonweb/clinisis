app.controller('AtendimentosConsultaExternaCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Atendimentos'
		},
		resource: {
			name: 'compra',
			desc: 'Atendimento Externo'
		},
		states: {
			lista: {},
			compra : {},
			cadastro : {}
		},
		redirectSaveToState: "lista",
		fields: {
			nome: {}
		}
	};
	
	$scope.iniciaratendimento = function(atendimento){
		$scope.modelObj = new Api.atendimentos.consulta();

		BaseCtrl.getAll(Api.atendimentos.consulta,{_id : atendimento._id},function(retorno){
				
				$scope.compra = retorno[0];
				$scope.compra.compra = retorno[0].saida.compra;
				$scope.compra.lancamento = retorno[0].saida.lancamento;

				
				angular.copy(retorno[0], $scope.modelObj);
				

				$scope.modelObj.nomepacientepesquisa = retorno[0].cliente.nome;
			
				if(retorno[0].profissional!=undefined){
					$scope.modelObj.profissional = retorno[0].profissional._id;
				}
				
				$scope.modelObj.data_atendimento = new Date(retorno[0].data_atendimento);
				$scope.modelObj.observacoes = retorno[0].observacoes;
				$scope.modelObj.status = 'AT';

				$scope.modelObj.$save()
				.then(
					function() {
						$state.go("atendimentos-compra-atendimento",{id :atendimento.saida._id,idatendimento : atendimento._id});
					}
				)
				.catch(
					function(erro) {
						$scope.mensagem = {
							erro: 'Não foi possível rejeitar'
						};
					}
				);	


		});	
	}

	$scope.lista = function(searchParams){
		if(searchParams == undefined){
			searchParams = {};
		}
		searchParams.externa = 1;

		var dthj = new Date();
        var dtontem = new Date();
        dtontem.setHours(0,0,0,0);
        $scope.dtontem = dtontem;
		
		var dtamanha = new Date();
        dtamanha.setHours(23,59,59,59);
        $scope.dtamanha = dtamanha

		BaseCtrl.getAll(Api.atendimentos.consulta,searchParams,function(retorno){
			
			angular.forEach(retorno, function(value, key){
				if(value.status == 'AG'){
					retorno[key].status = '1_AG';
				}
				if(value.status == 'AT'){
					retorno[key].status = '2_AT';
				}
				if(value.status == 'FI'){
					retorno[key].status = '89_FI';
				}
				if(value.status == 'CA'){
					retorno[key].status = '99_CA';
				}

				if(value.saida!=undefined){
					if(value.saida.compra!=undefined && value.saida.compra.cupom){
						Api.atendimentos.cupom.get({id : value.saida.compra.cupom},function(cupom){
							retorno[key].saida.compra.cupom = cupom;
						});
					}
				}

			});

			$scope.compras = retorno;
		
		});	
	}

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	if($state.current.name == 'atendimentos-consulta-externa-lista'){
		$scope.lista({});
	}
});
