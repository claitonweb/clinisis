app.controller('ComprasAtendimentoCtrl', function($location, $resource,$rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Atendimentos'
		},
		resource: {
			name: 'compra',
			desc: 'Atendimento'
		},
		states: {
			lista: {},
			compra : {}
		},
		redirectSaveToState: "lista",
		fields: {
			nome: {}
		}
	};

	
	
	$scope.modelObj = new Api.atendimentos.consulta();
	

	$scope.profissionais = BaseCtrl.getAll(Api.acl.usuario,{});
	$scope.data_atendimento = {};
	$scope.data_atendimento.opened = false;

	
	$scope.buscapaciente = function (){
		if($scope.modelObj.nomepacientepesquisa.length > 3){
			$scope.clientes = BaseCtrl.getAll(Api.cadastros.cliente,{pesquisaunica : $scope.modelObj.nomepacientepesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.clientes = '';
				}
			});
		}else{
			$scope.clientes = '';
		}
	}

	$scope.botoes = [{
		titulo : 'Salvar e Finalizar',
		class : 'btn-success',
		click : 'salvarefinalizar'
	}];

	$scope.selecionapaciente = function(paciente){
		$scope.modelObj.cliente = paciente._id;
		$scope.modelObj.nomepacientepesquisa = paciente.nome;
		$scope.modelObj.medico = paciente.medico;
		$scope.clientes = [];
	}
	
	
	$scope.lados = [{_id : 'SE',nome : 'Superior Esquerdo'},
					{_id : 'SD',nome : 'Superior Direito'},
					{_id : 'IE',nome : 'Inferior Esquerdo'},
					{_id : 'ID',nome : 'Inferior Direito'}
					];
	$scope.status = [{_id : 'AG',nome : 'Aguardando'},
					 {_id : 'AT',nome : 'Em Atendimento'},
					 {_id : 'FI',nome : 'Finalizado'},
					 {_id : 'CA',nome : 'Cancelado'}
					 ];
	$scope.doses = [
					{_id : '0',nome : 'Dose Única'},
					{_id : '1',nome : 'Primeira'},
					{_id : '2',nome : 'Segunda'},
					{_id : '3',nome : 'Terceira'}
					];				 

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	
	$scope.id = $stateParams.id;

	if($scope.modelObj!=undefined){
		$scope.modelObj.data_atendimento = new Date();
		$scope.modelObj.status = 'AG';
	}
	
	$scope.data_atendimento = {};
	$scope.data_atendimento.opened = false;
	
	
	
	$scope.obtem = function(){

		$scope.compra = '';
		var searchParams = {};
		searchParams._id = $stateParams.id;
		//console.log($stateParams.idatendimento);
			
		if($stateParams.idatendimento){
			BaseCtrl.getAll(Api.atendimentos.consulta,{_id : $stateParams.idatendimento},function(retorno){
				
				$scope.compra = retorno[0];
				$scope.compra.compra = retorno[0].saida.compra;
				$scope.compra.lancamento = retorno[0].saida.lancamento;

				
				angular.copy(retorno[0], $scope.modelObj);
				

				$scope.modelObj.nomepacientepesquisa = retorno[0].cliente.nome;
			
				if(retorno[0].profissional!=undefined){
					$scope.modelObj.profissional = retorno[0].profissional._id;
				}
				
				if(retorno[0].data_atendimento == '' || retorno[0].data_atendimento == undefined){
					$scope.modelObj.data_atendimento = new Date();
				}else{
					$scope.modelObj.data_atendimento = new Date(retorno[0].data_atendimento);
				}
				if($scope.modelObj.status == undefined || $scope.modelObj.status == ''){
					$scope.modelObj.status = 'AG';	
				}
				
				if($scope.modelObj.profissional == undefined || $scope.modelObj.profissional == ''){
					$resource('/usuario/verificalogado').query(
						function(usuario) {
							$scope.modelObj.profissional = usuario[0].user.usuario._id;
						},
						function(erro) {
							console.log('Erro ao verificar login');
							console.log(erro);
						}
					);
				}				

				$scope.modelObj.observacoes = retorno[0].observacoes;

				

			});	
		}else{
			
			BaseCtrl.getAll(Api.estoque.saidas,searchParams,function(retorno){
				$scope.compra = retorno[0];
				
				angular.copy(retorno[0], $scope.modelObj);
				
				delete $scope.modelObj._id;

				//$scope.modelObj = retorno[0];
				$scope.modelObj.data_atendimento = new Date();
				$scope.modelObj.status = 'AG';
				$scope.modelObj.saida = retorno[0]._id;

				$resource('/usuario/verificalogado').query(
					function(usuario) {
						$scope.modelObj.profissional = usuario[0].user.usuario._id;
					},
					function(erro) {
						console.log('Erro ao verificar login');
						console.log(erro);
					}
				);	

			});	

		}

	

		
	}	
	$scope.obtem();

	
	$scope.salvar = function(){
		var vai = true;
		$rootScope.mensagem = {};
		
		if(vai){
			if($scope.modelObj.cliente == '' || $scope.modelObj.cliente == undefined){
				$scope.mensagem = {
						erro: 'Selecione um cliente.'
				};
				vai = false;
			}
		}
		
		if(vai){
			$scope.modelObj.$save()
			.then(
				function() {
					$scope.mensagem = {
						texto: 'Salvo com sucesso'
					};
					$state.go('atendimentos-consulta-lista');
				}
			)
			.catch(
				function(erro) {
					$scope.mensagem = {
						erro: 'Não foi possível salvar'
					};
				}
			);
		}
	}

	$scope.chamafuncaoclick = function(obj){
		console.log(obj.click);
		$scope[obj.click]();
	}

	$scope.salvarefinalizar = function(objform){
		vai = true;

		

		if($scope.modelObj.lado == '' || $scope.modelObj.lado == undefined){
			$scope.mensagem = {
						erro: 'Selecione um membro.'
			};
			vai = false;
		}

		if(vai){
			if($scope.modelObj.profissional == '' || $scope.modelObj.profissional == undefined){
				$scope.mensagem = {
						erro: 'Selecione um profissional.'
				};
				vai = false;	
			}
		}

		if(vai){
			$scope.modelObj.status = 'FI';
			$scope.salvar();
		}

		
	}
		


	


});
