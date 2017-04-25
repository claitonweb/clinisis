app.config(function($stateProvider) {

	$stateProvider.state('index', {
			url: '/',
			templateUrl: 'core/main/profiles/adm/views/index.html',
			controller: 'IndexCtrl'
	});

	$stateProvider.state('atendimentos-compra-externa-lista', {
			url: '/atendimentos/compra/externas/lista',
			templateUrl: 'modules/atendimentos/compra/views/listacompraexterna.html',
			controller: 'AtendimentosCompraExternaCtrl'
	});
	$stateProvider.state('atendimentos-consulta-externa-lista', {
			url: '/atendimentos/consulta/externas/lista',
			templateUrl: 'modules/atendimentos/consulta/views/listaexterno.html',
			controller: 'AtendimentosConsultaExternaCtrl'
	});
	$stateProvider.state('estoque-inventario', {
			url: '/estoque/saidas/inventario',
			templateUrl: 'modules/estoque/saidas/views/inventario.html',
			controller: 'InventarioCtrl'
	});
	$stateProvider.state('financeiro-vendas', {
			url: '/financeiro/vendas',
			templateUrl: 'modules/financeiro/compras/views/vendas.html',
			controller: 'FinanceiroVendasCtrl'
	});
});
