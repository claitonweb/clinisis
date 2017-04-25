app.config(function($urlRouterProvider, $stateProvider, $httpProvider, uiMaskConfigProvider) {

	$httpProvider.interceptors.push('meuInterceptor');


	for (var modName in loadModules) {
		
		for (var resInd in loadModules[modName]) {
			var resName = loadModules[modName][resInd];
			var lowerMod = modName.toLowerCase();
			var lowerRes = resName.toLowerCase();
			//console.log('/' + lowerMod + '/' + lowerRes + '/lista');
			$stateProvider
				.state(lowerMod + '-' + lowerRes + '-lista', {
					url: '/' + lowerMod + '/' + lowerRes + '/lista',
					templateUrl: 'modules/' + lowerMod + '/' + lowerRes + '/views/lista.html',
					controller: modName + resName + 'Ctrl'
				})
				.state(lowerMod + '-' + lowerRes + '-cadastro', {
					url: '/' + lowerMod + '/' + lowerRes + '/cadastro/:id',
					templateUrl: 'modules/' + lowerMod + '/' + lowerRes + '/views/cadastro.html',
					controller: modName + resName + 'Ctrl'
				});
		}
	}

	$stateProvider
		.state('cadastros-clientes-aprovacao', {
			url: '/cadastros/clientes/aprovacao',
			templateUrl: 'views/cadastros/clientes-lista-aprovacao.html',
			controller: 'AprovacaoClientesCtrl'
		})
		.state('contribuicoes-tabelas-novo', {
			url: '/contribuicoes/tabelas/novo/:contribuicao',
			templateUrl: 'views/contribuicoes/contribuicoes-tabelas-cadastro.html',
			controller: 'ContribuicoesCtrl'
		})
		.state('pagamentos-contribuicoes-cliente', {
			url: '/contribuicoes/cliente/:cliente',
			templateUrl: 'views/contribuicoes/contribuicoes-cliente.html',
			controller: 'ContribuicoesClienteCtrl'
		})
		.state('pagamentos-contribuicoes-geracaolote', {
			url: '/contribuicoes/geracaolote',
			templateUrl: 'views/contribuicoes/contribuicoes-geracaolote.html',
			controller: 'ContribuicoesGeracaoLoteCtrl'
		})
		.state('financeiro-previsao-pagamentos', {
			url: '/contasapagar/previsao',
			templateUrl: 'views/contasapagar/previsao.html',
			controller: 'ContasapagarPrevisaoCtrl'
		})
		.state('financeiro-previsao-recebimentos', {
			url: '/contasareceber/previsao',
			templateUrl: 'views/contasareceber/previsao.html',
			controller: 'ContasareceberPrevisaoCtrl'
		})
		.state('atendimentos-consulta-visualizar', {
			url: '/atendimentos/consulta/visualizar/:id',
			templateUrl: 'modules/atendimentos/consulta/views/visualizar.html',
			controller: 'AtendimentosVisualizarCtrl'
		})
		.state('atendimentos-compra-atendimento', {
			url: '/atendimentos/compra/atendimento/:id/:idatendimento',
			templateUrl: 'modules/atendimentos/compra/views/atendimento.html',
			controller: 'ComprasAtendimentoCtrl'
		});

}).factory('Api', function($resource) {

	var Api = {};

	for (var modName in loadModules) {
		var lowerMod = modName.toLowerCase();

		Api[lowerMod] = {};

		for (var resInd in loadModules[modName]) {
			var lowerRes = loadModules[modName][resInd].toLowerCase();

			Api[lowerMod][lowerRes] = $resource('/' + lowerRes + '/:id');
		}
	}

	//ADICIONAR AQUI QUAISQUER SERVIÇOS COM ROUTES FORA DO PADRÃO {RESOURCE}/:id
	Api = angular.extend(Api, {
		aprovacao: $resource('/aprovacao'),
		rejeicao: $resource('/rejeicao'),
		validacao: $resource('/clientes/:id'), //ValidacaoService
		previsaoapagar: $resource('/contasapagar/previsao'),
		previsaoareceber: $resource('/contasareceber/previsao'),
		contribcliente: $resource('/tabelascontribuicao/cliente'),
		contribgeracao: $resource('/tabelascontribuicao/buscaclientesgeracaoemlote'),
		login: $resource('/login'),
		logincliente: $resource('/logincliente'),
		recuperarsenha: $resource('/recuperarsenha')
	});

	

	return Api;
});