app.config(function($stateProvider) {

	$stateProvider.state('auth-login-cliente', {
		url: '/login',
		templateUrl: 'core/main/login/views/login.html',
		controller: 'LoginCtrl'
	})

	.state('auth-login-adm', {
		url: '/loginadm',
		templateUrl: 'core/main/login/views/login.html',
		controller: 'LoginCtrl'
	})

	.state('auth-login-recuperarsenha', {
		url: '/recuperarsenha',
		templateUrl: 'core/main/login/views/recuperarsenha.html',
		controller: 'LoginCtrl'
	})

	.state('cadastros-clienteautocadastro-cadastro', {
		url: '/autocadastro',
		templateUrl: 'modules/cadastros/cliente/views/autocadastro.html',
		controller: 'CadastrosClienteAutoCadastro'
	});
});
