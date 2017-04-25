app.controller('CadastrosClienteCtrl', function($rootScope, $scope, 
	$routeParams, $stateParams, $state, $filter, $window, Api, Notification) {

	$scope.config = {
		module: {
			name: 'cadastros',
			desc: 'Cadastros'
		},
		resource: {
			name: 'cliente',
			desc: 'Clientes'
		},
		states: {
			lista: {},
			cadastro: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "cpfcnpj", //|| pessoa.cnpj
				desc: "CPF"
			},
			{
				name: "dtnascimento",
				desc: "Dt. Nasc"
			},
			{
				name: "nome",
				desc: "Nome"
			},
			{
				name: "telefone",
				desc: "Telefone"
			},
			{
				name: "email",
				desc: "E-mail"
			},
			{
				name: "login",
				desc: "Login"
			},
			{
				name: "clientepai",
				subname : 'nome',
				desc: "Pai"
				
			}
			/*{
				name: "status.nome",
				desc: "Situação"
				//style="background: {{cliente.status.cor}};text-align: center;"
			}*/
		],
		fields: {
			nome: {}
		}
	};
	
	$scope.beforeCadastro = function(){
		$scope.estados = BaseCtrl.getAll(Api.admconfs.estado);
		$scope.medicos = BaseCtrl.getAll(Api.cadastros.medico);

	};

	$scope.afterCadastro = function(){
		if($rootScope.usuariologado	!= undefined){
			$scope.atendimentos = BaseCtrl.getAll(Api.atendimentos.consulta,{cliente : $scope.modelObj._id});
		}

		angular.forEach($scope.estados, function(value, key){
				if(value.sigla == 'RS'){
					$scope.modelObj.estado = value._id;
					$scope.cidades = value.cidades;
				}
		});
		if($scope.modelObj.tipopessoa == undefined || $scope.modelObj.tipopessoa == ''){
			$scope.modelObj.tipopessoa = 'f';
		}

		$scope.modelObj.dependentes = [];
		$scope.dependentes = [];
		$scope.dependentesjaadicionados = [];

		if($stateParams.id){
			BaseCtrl.getAll(Api.cadastros.cliente,{clientepai : $stateParams.id},function(retorno){
				angular.forEach(retorno, function(value, key){
					$scope.dependentes.push(value);
					$scope.dependentesjaadicionados.push(value);	
				});

			});	
		}

		$scope.modelObj.password = '';
		

	};

	$scope.usuario = new Api.acl.usuario();

	/*
	$scope.usuario.$save()
						.then(function(retorno) {
							$rootScope.mensagem = {
								texto: 'Salvo com sucesso.'
							};
							
							$scope.afterSalvar(retorno);

							
						})
						.catch(function(error) {
							var errorMsg = 'Não foi possível salvar';

							if (error.data != undefined) {
								if (error.data.message != undefined) {
									errorMsg = errorMsg + ' ' + error.data.message;
								}

								if (error.data.code == 11000) {
									error.data.message = error.data.value + " " + $scope.modelObj[error.data.field] + " já está em uso.";
									$scope.modelObj[error.data.field].$setValidity("required", false);
								}
							}

							$rootScope.mensagem = {
								texto: errorMsg
							};
						});
	*/

	$scope.adicionarDependente = function(){
		var dependente = angular.copy($scope.modelObj.dependente); 

		if($stateParams.id !=undefined){
			var obj = new $scope.modelService();
			angular.merge(obj,dependente);
			obj.clientepai = $scope.modelObj._id;
			
			obj.$save()
			   .then(function(retorno) {
					console.log('salvo dependente',obj);
					$scope.dependentes.push(retorno);
					$scope.modelObj.dependente = '';
				})
			   .catch(function(error) {
					console.log('erro salvar dependente',error);
					$scope.modelObj.dependente = '';
				});

		}else{
			$scope.modelObj.dependente = '';
			$scope.dependentes.push(dependente);
		}
		
	}

	$scope.salvadependentes  = function(id){
		if($scope.dependentes.length > 0){
			angular.forEach($scope.dependentes, function(dependente, key){
				var obj = new $scope.modelService();
				angular.merge(obj,dependente);

				//obj.clientepai = retorno._id;
				obj.clientepai = id;

				obj.$save()
						.then(function(retorno) {
							console.log('salvo dependente',obj);
						})
						.catch(function(error) {
							console.log('erro salvar dependente',error);
						});
			});
		}
	}

	$scope.afterSalvar = function(retorno){
		
		if (!$stateParams.id) {
			$scope.salvadependentes(retorno._id);
		}

		if($rootScope.usuariologado	!= undefined){
			$state.go('cadastros-cliente-cadastro',{id : retorno._id});	
		}else{
			//$state.go('cadastroexterno-cliente',{id : retorno._id});
			
			$state.go('auth-login-cliente');
		
		}
	}

	$scope.buscacidades = function(){
		if($scope.modelObj!=undefined){
			var idestado = $scope.modelObj.estado;
			angular.forEach($scope.estados, function(value, key){
				if(value._id == idestado){
					$scope.cidades = value.cidades;
				}
			});		
		}
		
	}

	
	
	$scope.preparar = function(){
		if($scope.modelObj!=undefined){
			
			

			//console.log('a');
			
			//if($scope.modelObj.tipessoa == undefined || $scope.modelObj.tipessoa == ''){
			//	$scope.modelObj.tipessoa = 'f';	
			//}
			
		

			/*if($scope.modelObj.tipessoa === 'f'){
				$scope.modelObj.dtnascimento = new Date($scope.modelObj.dtnascimento);	
			}*/
			//$scope.buscacidades();
		}
	}

	
	//$scope.$watch('modelObj', $scope.preparar);
	$scope.$watch('modelObj.estado', $scope.buscacidades);

	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api, Notification);


});
