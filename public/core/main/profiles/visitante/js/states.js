app.config(function($stateProvider) {

	$stateProvider.state('index', {
			url: '/',
			templateUrl: 'core/main/login/views/login.html',
			controller: 'LoginCtrl'
	});
	$stateProvider.state('cadastroexterno-cliente', {
			url: '/cliente/cadastro/:id',
			templateUrl: 'modules/cadastros/cliente/views/cadastroexterno.html',
			controller: 'CadastrosClienteCtrl'
	});

});
