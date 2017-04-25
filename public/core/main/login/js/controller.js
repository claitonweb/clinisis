app.controller('LoginCtrl',
	function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

		switch ($state.current.name) {
			case 'auth-login-adm':
				$scope.tipologin = 'Administrativo';
				break;

			case 'auth-login-cliente':
				$scope.tipologin = 'Cliente';
				break;

			case 'auth-login-recuperarsenha':
				break;

			default:
				break;
		}



		$scope.efetuarLogin = function() {
			if ($scope.formlogin.$valid) {

				var login = Api.login;

				if($state.current.name == 'auth-login-cliente'){
					login = Api.logincliente
				}

				login.save({
					'username': $scope.usuario.username,
					'password': $scope.usuario.password
				}, function(login) {

					//$scope.login = login
					$rootScope.mensagem = {
						texto: 'Logado com sucesso!'
					};

					if($state.current.name == 'auth-login-cliente'){
						$window.location.href = '/index';
					}else{
						console.log('admin');
						$window.location.href = '/';	
					}
					

				}, function(erro) {

					$rootScope.mensagem = {
						erro: erro
					};
				}).$promise.catch(function(response) {
					if (response.status == 401) {
						$rootScope.mensagem = {
							erro: response.data[0]
						};
					}
				});

				/*Logincliente.save({
					'username': $scope.usuario.username,
					'password': $scope.usuario.password
				}, function(login) {

					//$scope.login = login
					$rootScope.mensagem = {
						texto: 'Logado com sucesso!'
					};
					$window.location.href = '/cliente';

				}, function(erro) {
					console.log(erro.data);

					if (erro.status == 401) {
						$rootScope.mensagem = {
							erro: erro.data[0]
						};
					}

					//$rootScope.mensagem = { erro : 'Erro ao efetuar login' };
				}).$promise.catch(function(response) {
					if (response.status == 404) {
						$rootScope.mensagem = {
							erro: response.data
						};
					}
				});*/

			} else {
				angular.forEach($scope.formlogin.$error.required, function(field) {
					field.$setTouched();
				});
			}
		}

		$scope.recuperarsenha = function() {
			if ($scope.formRecuperarSenha.$valid) {

				Recuperarsenha.save({
					'username': $scope.usuario.username
				}, function(login) {

					console.log(login);
					//$scope.login = login
					$rootScope.mensagem = {
						texto: 'Uma nova senha foi enviada para seu e-mail.'
					};
					//$state.go('index');
					//$window.location.href = '/cliente';

				}, function(erro) {
					console.log(erro);
					$rootScope.mensagem = {
						//erro : erro
						erro: 'Erro ao recuperar senha'
					};
				}).$promise.catch(function(response) {

					if (response.status == 404) {
						$rootScope.mensagem = {
							erro: response.data
						};
					}

				});

			} else {
				angular.forEach($scope.formRecuperarSenha.$error.required, function(field) {
					field.$setTouched();
				});
			}
		}
	});
