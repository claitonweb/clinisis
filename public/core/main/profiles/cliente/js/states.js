app.config(function($stateProvider) {

	/*$stateProvider.state('index', {
			url: '/',
			templateUrl: 'core/main/cliente/views/index.html',
			controller: 'IndexCtrl'
	});*/

	$stateProvider.state('index', {
			url: '/',
			templateUrl: 'core/main/profiles/cliente/views/index.html',
			controller: 'IndexCtrl'
	});

	$stateProvider.state('cadastroexterno-cliente', {
			url: '/cliente/cadastro/:id',
			templateUrl: 'modules/cadastros/cliente/views/cadastroexterno.html',
			controller: 'CadastrosClienteCtrl'
	});

	$stateProvider.state('atendimento-compracliente-cadastro', {
			url: '/atendimento/cliente/compra/cadastro/:id',
			templateUrl: 'modules/atendimentos/compra/views/cadastrocliente.html',
			controller: 'AtendimentosCompraClienteCtrl'
	});

	$stateProvider.state('atendimento-compracliente-lista', {
			url: '/atendimento/cliente/compra/lista',
			templateUrl: 'modules/atendimentos/compra/views/listacliente.html',
			controller: 'AtendimentosCompraClienteCtrl'
	});

	$stateProvider.state('atendimento-compracliente-sucesso', {
			url: '/compra/sucesso',
			templateUrl: 'modules/atendimentos/compra/views/sucesso.html',
			//controller: 'AtendimentosCompraClienteCtrl'
	});

	$stateProvider.state('atendimento-compracupom-cadastro', {
			url: '/compra/cupom/:id',
			templateUrl: 'modules/atendimentos/compra/views/cupom.html',
			controller: 'AtendimentosCupomCtrl'
	});
});
