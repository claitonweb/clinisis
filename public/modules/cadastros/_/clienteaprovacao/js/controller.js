app.controller('CadastrosClienteAprovacaoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, ngDialog, Api) {

	switch ($state.current.name) {
		case 'cadastros-clientes-aprovacao':
			$scope.lista();
			break;
	}

	$scope.atividades = BaseCtrl.getAll(Api.admconfs.atividade);
	$scope.cnaes = BaseCtrl.getAll(Api.admconfs.cnae);
	$scope.nj = BaseCtrl.getAll(Api.admconfs.naturezajuridica);

	$scope.pesquisacliente = '';

	function lista(pesquisa) {
		$scope.clientes = '';

		Estados.query({
				'sigla': 'RS'
			},
			function(estadosCidades) {
				$scope.cidades = estadosCidades[0].cidades;
			},
			function(erro) {
				console.log("Não foi possível obter a lista de contatos");
				console.log(erro);
			});

		Situacoescadastro.query({
			'ordem': '1'
		}, function(status) {

			if (pesquisa == undefined) {
				var pesquisa = {};
				//pesquisa.status = {};
			}
			//pesquisa.status = status[0]._id;

			Clientes.query(pesquisa,
				function(clientes) {
					$scope.clientes = clientes;
				},
				function(erro) {
					console.log(erro);
				}
			);

		}, function(erro) {
			$rootScope.mensagem = {
				erro: 'Não foi possível obter a lista de Status.'
			};
		});
	}

	$scope.lista = function() {
		lista();
	}

	$scope.pesquisar = function() {
		var pesquisa = $scope.pesquisacliente;
		for (var name in pesquisa) {
			if (pesquisa.hasOwnProperty(name)) {
				if (pesquisa[name] == '') {
					delete pesquisa[name];
				}
			}
		}

		lista(pesquisa)
	}

	$scope.aprovar = function(cliente) {
		var aprov = new Aprovacao();

		aprov.id = cliente._id;

		aprov.$save()
			.then(
				function() {
					$rootScope.mensagem = {
						texto: 'Aprovado com sucesso'
					};
					lista();
					//$state.go('cadastros-atividade-lista');
				}
			)
			.catch(
				function(erro) {
					$rootScope.mensagem = {
						texto: 'Não foi possível aprovar'
					};
				}
			);
	}

	$rootScope.justificativa = '';
	$rootScope.clienteselecionado = '';
	$scope.dialog = '';
	$scope.justificar = function(cliente) {
		$scope.dialog = ngDialog.open({
			template: 'justificativa',
			className: 'ngdialog-theme-plain',
			scope: $rootScope
		});
		$rootScope.clienteselecionado = cliente;
	}

	$rootScope.rejeitar = function() {
		$scope.dialog.close();

		var reje = new Rejeicao();

		reje.id = $rootScope.clienteselecionado._id;
		reje.justificativa = 'Sem justificativa';

		if ($rootScope.clienteselecionado.justificativa != '') {
			reje.justificativa = $rootScope.clienteselecionado.justificativa;
		}

		reje.$save()
			.then(
				function() {
					$rootScope.mensagem = {
						texto: 'Rejeitado com sucesso'
					};
					lista();
					//$state.go('cadastros-atividade-lista');
				}
			)
			.catch(
				function(erro) {
					$rootScope.mensagem = {
						texto: 'Não foi possível rejeitar'
					};
				}
			);
	}
});
