app.controller('CadastrosClienteExternoCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	switch ($state.current.name) {
		case 'cadastros-clientes-novo':
			cadastro();
			break;
		case 'cadastros-clientes-editarperfil':
			cadastro();
			break;
		case 'cadastros-clientes-lista':
			$scope.lista();
			break;

		default:
			cadastro();
			break;
	}

	//$scope.modelViewValue = true;

	$scope.tipoPessoa('PJ') = function() {

		if ($scope.cliente && $scope.cliente.tipopessoa == 'j') {
			return true;
		} else {
			return false;
		}
	}

	$scope.tipoPessoa('PF') = function() {

		if ($scope.cliente && $scope.cliente.tipopessoa == 'f') {
			return true;
		} else {
			return false;
		}
	}

	function buscaestadoscidades() {
		Estados.query({
				'sigla': 'RS'
			},
			function(estadosCidades) {
				$scope.estadosCidades = estadosCidades;
				$scope.cidades = estadosCidades[0].cidades;

				//console.log(estadosCidades);
			},
			function(erro) {
				console.log("Não foi possível obter a lista de contatos");
				console.log(erro);
			});
	}

	$scope.buscaestadoscidadesById = function() {

		var id = $scope.cliente.endereco.estado;
		Estados.query({
				_id: id
			},
			function(estadosCidades) {
				$scope.cidades = estadosCidades[0].cidades;
			},
			function(erro) {
				console.log("Não foi possível obter a lista de contatos");
				console.log(erro);
			});
	}

	$scope.cliente = new Clientes();
	$scope.cliente.associado = '1';
	$scope.cliente.dtcadastro = new Date();
	$scope.cliente.dtmodificacao = new Date();
	$scope.cliente.ativo = true;
	$scope.cliente.colaborador = [];
	$scope.cliente.contato = [];

	Atividades.query(function(atividades) {
		$scope.atividades = atividades;
	}, function(erro) {
		$rootScope.mensagem = {
			erro: 'Não foi possível obter a lista de Atividades.'
		};
	});

	Cnaes.query(function(listacnaes) {
		$scope.cnaes = listacnaes;
	}, function(erro) {
		$rootScope.mensagem = {
			erro: 'Não foi possível obter a lista de Cnaes.'
		};
	});

	Naturezasjuridicas.query(function(nj) {
		$scope.nj = nj;
	}, function(erro) {
		$rootScope.mensagem = {
			erro: 'Não foi possível obter a lista de Naturezas Juridicas.'
		};
	});
	Situacoescadastro.query({
		'ordem': '1'
	}, function(status) {
		$scope.cliente.status = status[0]._id;

		$scope.status = status;

	}, function(erro) {
		$rootScope.mensagem = {
			erro: 'Não foi possível obter a lista de Status.'
		};
	});

	function cadastro() {

		Tiposcolaboradores.query(function(tc) {
			$scope.tiposdecolaboradores = tc;
		}, function(erro) {
			$rootScope.mensagem = {
				erro: 'Não foi possível obter a lista de Tipos de Colaborador.'
			};
		});

		//buscaestadoscidades();

		if ($stateParams.id) {
			Clientes.get({
					id: $stateParams.id
				},
				function(cliente) {
					cliente.oldpassword = cliente.password;
					cliente.password = '';

					cliente.dtcadastro = cliente.dtcadastro != undefined ? new Date(cliente.dtcadastro) : new Date();
					cliente.dtmodificacao = cliente.dtmodificacao != undefined ? new Date(cliente.dtmodificacao) : new Date();
					cliente.dtnascimento = cliente.dtnascimento != undefined ? new Date(cliente.dtnascimento) : new Date();
					cliente.dtfundacao = cliente.dtfundacao != undefined ? new Date(cliente.dtfundacao) : new Date();

					if (cliente.colaborador == undefined) {
						cliente.colaborador = [];
					}
					if (cliente.contato == undefined) {
						cliente.contato = [];
					}
					$scope.cliente = cliente;

					Estados.query({
							'sigla': 'RS'
						},
						function(estadosCidades) {
							$scope.estadosCidades = estadosCidades;
							$scope.cidades = estadosCidades[0].cidades;

							$scope.cliente.endereco = {};
							$scope.cliente.endereco[0] = {};
							$scope.cliente.endereco[0]['estado'] = estadosCidades[0]._id;
							$scope.cliente.endereco[0]['tipo'] = 'f';

							$scope.cliente.endereco[1] = {};
							$scope.cliente.endereco[1]['estado'] = estadosCidades[0]._id;
							$scope.cliente.endereco[1]['tipo'] = 'c';

						},
						function(erro) {
							console.log("Não foi possível obter a lista de contatos");
							console.log(erro);
						});

					if (cliente.endereco) {
						if (cliente.endereco.estado != undefined) {
							$scope.buscaestadoscidadesById();
						}
					}

				},
				function(erro) {
					$rootScope.mensagem = {
						texto: 'Classificado não existe.'
					};
				}
			);
		} else {
			Estados.query({
					'sigla': 'RS'
				},
				function(estadosCidades) {
					$scope.estadosCidades = estadosCidades;
					$scope.cidades = estadosCidades[0].cidades;

					$scope.cliente.endereco = {};
					$scope.cliente.endereco[0] = {};
					$scope.cliente.endereco[0]['estado'] = estadosCidades[0]._id;
					$scope.cliente.endereco[0]['tipo'] = 'f';

					$scope.cliente.endereco[1] = {};
					$scope.cliente.endereco[1]['estado'] = estadosCidades[0]._id;
					$scope.cliente.endereco[1]['tipo'] = 'c';
				},
				function(erro) {
					console.log("Não foi possível obter a lista de contatos");
					console.log(erro);
				});

			$scope.cliente.externo = true;
		}

		$scope.dateOptions = {
			formatYear: 'yy',
			maxDate: new Date(2020, 5, 22),
			//minDate: new Date(),
			showWeeks: false,
			startingDay: 1
		};

		$scope.dateOptions2 = {
			formatYear: 'yy',
			maxDate: new Date(),
			//minDate: new Date(),
			showWeeks: false,
			startingDay: 1
		};

		$scope.formats = ['dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];

		$scope.dtcadastro = {
			opened: false
		};
		$scope.dtmodificacao = {
			opened: false
		};
		$scope.dtnascimento = {
			opened: false
		};
		$scope.dtfundacao = {
			opened: false
		};
		$scope.colaboradordtnascimento = {
			opened: false
		}

		$scope.opendtcadastro = function() {
			$scope.dtcadastro.opened = true;
		};
		$scope.opendtmodificacao = function() {
			$scope.dtmodificacao.opened = true;
		};
		$scope.opendtnascimento = function() {
			$scope.dtnascimento.opened = true;
		};
		$scope.opencolaboradordtnascimento = function() {
			$scope.colaboradordtnascimento.opened = true;
		};

		$scope.opendtfundacao = function() {
			$scope.dtfundacao.opened = true;
		};

		$scope.contato = '';
		$scope.colaborador = '';

		$scope.altInputFormats = ['d!/M!/yyyy'];
	}

	$scope.adicionarContato = function() {

		var ir = true;
		$scope.cadastrocliente.telefone.$setValidity("required", true);
		$scope.cadastrocliente.email.$setValidity("required", true);

		if ($scope.cadastrocliente.telefone.$isEmpty($scope.cadastrocliente.telefone.$viewValue)) {
			if ($scope.cadastrocliente.email.$isEmpty($scope.cadastrocliente.email.$viewValue)) {
				$scope.cadastrocliente.telefone.$setValidity("required", false);
				ir = false;
			}
		}

		if ($scope.cadastrocliente.email.$isEmpty($scope.cadastrocliente.email.$viewValue)) {
			if ($scope.cadastrocliente.telefone.$isEmpty($scope.cadastrocliente.telefone.$viewValue)) {
				$scope.cadastrocliente.email.$setValidity("required", false);
				ir = false;
			}
		}

		if (ir) {
			$scope.cliente.contato.push($scope.contato);
			$scope.contato = '';
		}
	}
	$scope.cancelarContato = function() {
		$scope.cadastrocliente.telefone.$setValidity("required", true);
		$scope.cadastrocliente.email.$setValidity("required", true);
		$scope.contato = '';
	}

	$scope.removerContato = function(index) {
		$scope.cliente.contato.splice(index, 1);
	}

	$scope.adicionarColaborador = function() {
		var ir = true;
		$scope.cadastrocliente.colaboradorTipo.$setValidity("required", true);
		$scope.cadastrocliente.colaboradorNome.$setValidity("required", true);
		$scope.cadastrocliente.colaboradorCpf.$setValidity("required", true);

		if ($scope.cadastrocliente.colaboradorTipo.$isEmpty($scope.cadastrocliente.colaboradorTipo.$viewValue)) {
			$scope.cadastrocliente.colaboradorTipo.$setValidity("required", false);
			ir = false;
		}

		if ($scope.cadastrocliente.colaboradorNome.$isEmpty($scope.cadastrocliente.colaboradorNome.$viewValue)) {
			$scope.cadastrocliente.colaboradorNome.$setValidity("required", false);
			ir = false;
		}
		if ($scope.cadastrocliente.colaboradorCpf.$isEmpty($scope.cadastrocliente.colaboradorCpf.$viewValue)) {
			$scope.cadastrocliente.colaboradorCpf.$setValidity("required", false);
			ir = false;
		}

		if (ir) {

			$scope.cliente.colaborador.push($scope.colaborador);
			$scope.colaborador = '';
		}
	}

	$scope.removerColaborador = function(index) {
		$scope.cliente.colaborador.splice(index, 1);
	}

	$scope.cancelarColaborador = function() {
		$scope.cadastrocliente.colaboradorTipo.$setValidity("required", true);
		$scope.cadastrocliente.colaboradorNome.$setValidity("required", true);
		$scope.cadastrocliente.colaboradorCpf.$setValidity("required", true);

		$scope.colaborador = '';
	}

	$scope.selecionaEnderecoCorrespondencia = function(index) {
		angular.forEach($scope.cliente.endereco, function(field) {
			delete field.correspondencia;
		});
		$scope.cliente.endereco[index].correspondencia = 't';
	}

	function salva() {
		$scope.cliente.dtmodificacao = new Date();

		$scope.cliente.$save().then(
				function() {
					$rootScope.mensagem = {
						texto: 'Salvo com sucesso'
					};

					if ($stateParams.id == undefined) {
						$scope.cliente = new Clientes();
					}

					$scope.cliente.dtcadastro = $scope.cliente.dtcadastro != undefined ? new Date($scope.cliente.dtcadastro) : new Date();
					$scope.cliente.dtmodificacao = $scope.cliente.dtmodificacao != undefined ? new Date($scope.cliente.dtmodificacao) : new Date();
					$scope.cliente.dtnascimento = $scope.cliente.dtnascimento != undefined ? new Date($scope.cliente.dtnascimento) : new Date();
					$scope.cliente.dtfundacao = $scope.cliente.dtfundacao != undefined ? new Date($scope.cliente.dtfundacao) : new Date();

					$rootScope.mensagem = {
						texto: 'Salvo com sucesso'
					};

					if (!$stateParams.id) {
						$window.location.href = '/cliente/login';
					}
					//$state.go('cadastros-clientes-lista');
				}
			)
			.catch(
				function(erro) {

					if (erro.data.code == 11000) {
						erro.data.message = "Usuário " + $scope.usuario.username + " já está em uso.";
					}

					$scope.cadastrocliente.username.$setValidity("required", false);
					$rootScope.mensagem = {
						erro: 'Não foi possível salvar: ' + erro.data.message
					};
				}
			);
	}

	$scope.salvarCliente = function() {
		if ($scope.cadastrocliente.$valid) {
			salva();
		} else {
			angular.forEach($scope.cadastrocliente.$error.required, function(field) {
				field.$setTouched();
			});
		}
	}

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

		Clientes.query(pesquisa,
			function(clientes) {
				$scope.clientes = clientes;
			},
			function(erro) {
				console.log(erro);
			}
		);
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
});
