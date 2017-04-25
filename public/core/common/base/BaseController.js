var BaseCtrl = {

	extendFunctions: function($rootScope, $scope, $state, $stateParams, Api, Notification) {

		return {
			lista: function(searchParams) {
				//$scope.searchReturn = "";
				$scope.searchReturn = [];
				//console.log(searchParams);
				var ultimo = $scope.searchReturn.length;
				var posicao = 0;
				
				if(typeof $scope.Notification == 'function'){
					$scope.Notification({message: 'Carregando',delay : 500000 ,replaceMessage: true, positionY: 'bottom', positionX: 'left'}, 'info');		
				}
				
				
				$scope.modelService.query(searchParams,
					function(ret) {
						$scope.retorno = ret;
						$scope.total = ret.length;

						//prevenir erro com os outros controllers 
						//que não utilizam a paginação
						if(typeof $scope.Notification == 'function'){
							$scope.Notification.clearAll();
							for(var i = 0; i < 10; i++) {
								posicao = ultimo + i;
								if(posicao < $scope.total){
									$scope.searchReturn.push(ret[posicao]);
								}
							}
						}else{
							$scope.searchReturn = ret;
								
						}

						
						

						//$scope.searchReturn = ret;
					},
					function(error) {
						console.log(error);
					}
				);
			},
			loadmore : function(){
				var ultimo = $scope.searchReturn.length;
				if(ultimo < $scope.total){
					
					$scope.Notification({message: 'Carregando',replaceMessage: true, positionY: 'bottom', positionX: 'left'}, 'info');
						
					for(var i = 0; i < 10; i++) {
						posicao = ultimo + i;
						if(posicao < $scope.total){
							$scope.searchReturn.push($scope.retorno[posicao]);	
						}
						
					}	
				}
				
			},

			beforeCadastro: function() {},
			afterCadastro: function() {},

			tratarRetornoBuscaParaEdicao: function(retorno) {
				angular.forEach(retorno, function(value, key){
					if(value!=''){
						if(key.indexOf('data_') >=0){
							retorno[key] = new Date(value);
						}
						if(key.indexOf('dt') >=0){
							retorno[key] = new Date(value);
						}	
					}
					
				});
				return retorno;
			},

			cadastro: function() {
				
				if ($stateParams.id) {
					$scope.modelService.get({
							id: $stateParams.id
						},
						function(ret) {
							$scope.modelObj = $scope.tratarRetornoBuscaParaEdicao(ret);
							
							$scope.afterCadastro();
						},
						function(error) {
							$rootScope.mensagem = {
								texto: 'Não existe.'
							};
						}
					);
				} else {
					$scope.modelObj = new $scope.modelService();
					$scope.afterCadastro();
				}

				$scope.beforeCadastro();

			},

			salvar: function(formObj) {
				if (formObj.$valid) {
					$scope.modelObj.$save()
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
				}
				else {
					$rootScope.mensagem = {
						erro: 'Preencha os campos obrigatórios.'
					};
					console.log(formObj.$error);
					if (angular.isDefined(formObj.$error.required)) {
						angular.forEach(formObj.$error.required, function(field) {
							field.$setTouched();
						});
					}
				}
			},

			afterSalvar: function() {
				$state.go($scope.states[$scope.config.redirectSaveToState].fullName);
			},
		}
	},

	build: function($rootScope, $scope, $state, $stateParams, Api, Notification) {
		$scope.modelService = Api[$scope.config.module.name][$scope.config.resource.name];
		$scope.searchParams = "";
		$scope.Notification = Notification;
		//joga as funções do base para o scope do controller
		var fns = this.extendFunctions($rootScope, $scope, $state, $stateParams, Api, Notification);
		for(var fn in fns){
			if(!angular.isDefined($scope[fn])){
				$scope[fn] = fns[fn];
			}
		}

		for (var stateName in $scope.config.states) {
			//console.log($scope.config.module.name + '-' + $scope.config.resource.name + '-' + stateName);
			//joga os nomes completos dos states para o scope, para serem usados nas views
			if ($scope.states == undefined) $scope.states = {};
			$scope.states[stateName] = {
				fullName: $scope.config.module.name + '-' + $scope.config.resource.name + '-' + stateName
			};

			//executa a função do state atual
			var excecoes = ['cadastroexterno-cliente','atendimento-compracliente-cadastro'];

			if ($scope.states[stateName].fullName == $state.current.name) {
				
				$scope[stateName]();
			}else{
				if(excecoes.indexOf($state.current.name) >=0){
					$scope.cadastro();
				}
			}
		}
		

		//retorna o scope
		return $scope;
	},

	getAll: function(modelService, queryObj, callback) {
		if (queryObj == undefined) queryObj = {};

		var retorno = modelService.query(queryObj,
			function(ret) {
				if(callback !=undefined) callback(ret);

				return ret;
			},
			function(error) {
				$rootScope.mensagem = {
					erro: 'Não foi possível obter a lista de perfis: ' + error.data.message
				};
				console.log($rootScope.mensagem);
			}
		);

		return retorno;
	}
};
