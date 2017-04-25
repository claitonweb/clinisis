app.controller('mainCtrl', function($scope, $state, $rootScope, $resource, $window, AclService) { //['$rootScope', '$scope', '$state', '$resource', '$window', 'AclService',

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
					console.log('pode ' + toState.name);
				} else {
					//$window.location.href = '/';
					console.log('Não pode '+toState.name);
				}
			} catch (err) {
				//$window.location.href = '/';
				console.log('Não pode ' + toState.name);
			}
		}

	}

	function verificaLogado(toState) {
		
		$resource('/usuario/verificalogado').query('', function(usuario) {
			//está logado
			$scope.usuariologado = usuario;
			//console.log(usuario);       
			verificapermissao(toState);

		}, function(erro) {

			$scope.mensagem = {
				//erro : erro
			};
		}).$promise.catch(function(response) {
			if (response.status == 401) {
				$window.location.href = '#/loginadm'; //descomentar depois
			}
			$scope.mensagem = {
				erro: response.data
			};
		});
	}

	$scope.buscaCepCorreios = function() {
		window.open('http://www.buscacep.correios.com.br/servicos/dnec/index.do');
	}
	$scope.buscaCnpjReceita = function() {
		window.open('http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/Cnpjreva_Solicitacao.asp');
	}
	$scope.buscaCpfReceita = function() {
		window.open('https://www.receita.fazenda.gov.br/Aplicacoes/SSL/ATCTA/CPF/ConsultaPublica.asp');
	}

	$scope.dateOptions = {
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		showWeeks: false,
		startingDay: 1
	};
	
	$scope.altInputFormats = ['d!/M!/yyyy'];

	$scope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams) {
			$scope.mensagem = '';
			verificaLogado(toState);
		});
});
