app.controller('mainCtrl', ['$rootScope', '$scope', '$state', '$resource', '$window', function($scope, $state, $rootScope, $resource, $window) {

	$scope.$on('LastRepeaterElement', function() {
		var page			= angular.element('#page-container'),
			sidebar			= angular.element('#sidebar'),
			allLinks 		= angular.element('.sidebar-nav a', sidebar),
			menuLinks 		= angular.element('.sidebar-nav-menu', sidebar),
			submenuLinks	= angular.element('.sidebar-nav-submenu', sidebar);

		// Primary Accordion functionality
		menuLinks.on('click', function(e) {
			var link	= angular.element(this),
				windowW	= window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			// If we are in mini sidebar mode
			if (page.hasClass('sidebar-visible-lg-mini') && (windowW > 991)) {
				if (link.hasClass('open')) {
					link.removeClass('open');
				} else {
					angular.element('#sidebar .sidebar-nav-menu.open').removeClass('open');
					link.addClass('open');
				}
			} else if (!link.parent().hasClass('active')) {
				if (link.hasClass('open')) {
					link.removeClass('open');
				} else {
					angular.element('#sidebar .sidebar-nav-menu.open').removeClass('open');
					link.addClass('open');
				}
			}

			return false;
		});
	});

	$scope.tempermissao = function(state) {
		console.log(state);
		return true;

		/*try {
			if (AclService.can(state)) {
				return true;
			}
			else {
				console.log('n pode' + state);
				return false;
			}
		}
		catch (err) {
			console.log(state);
			console.log(err);
			return false;
			//console.log('Não pode '+toState.name);
		}

		//return AclService.can(state);*/
	}

	function verificapermissao(toState) {
		if (toState.name != 'index') {
			try {
				if (AclService.can(toState.name)) {
					console.log('pode' + toState.name);
				} else {
					$window.location.href = '/';
					//console.log('Não pode '+toState.name);
				}
			} catch (err) {
				$window.location.href = '/';
				console.log('Não pode ' + toState.name);
			}
		}

	}

	function verificalogado() {

		$resource('/cliente/verificalogado').query('',
			function(usuario) {
				//console.log(usuario[0].usuario);
				$scope.usuariologado = usuario;
			},
			function(erro) {
				//console.log(erro);
				//$window.location.href = '/app#/login';
				$scope.mensagem = {
					erro: 'Ocorreu um erro ao verificar autenticação'
				};
			}
		).$promise.catch(function(response) {

			if (response.status == 401) {
				$window.location.href = '/app#/login';
			}
			/*$scope.mensagem = {
				erro : response.data
			};*/
		});
	}

	$scope.buscacepCorreios = function() {
		window.open('http://www.buscacep.correios.com.br/servicos/dnec/index.do');
	}
	$scope.buscaCnpjReceita = function() {
		window.open('http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/Cnpjreva_Solicitacao.asp');
	}

	$rootScope.clienteexterno = true;

	$scope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams) {
			$scope.clienteexterno = true;
			//console.log(toState);
			if(toState.name !='auth-login-cliente' && toState.name!='cadastroexterno-cliente'){
				verificalogado();	
			}
			
			$scope.mensagem = '';
		});

	}]);
