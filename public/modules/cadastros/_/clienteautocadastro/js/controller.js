app.controller('CadastrosClienteAutoCadastroCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, $filter, $window, Api) {

	switch ($state.current.name) {
		case 'cadastros-clienteautocadastro-novo':
			cadastro();
			break;
		case 'cadastros-clienteautocadastro-editar':
			cadastro();
			break;
		case 'cadastros-clienteautocadastro-lista':
			$scope.lista();
			break;
		case 'cadastros-clienteautocadastro-editarperfil':
			cadastro();
			break;
		case 'cadastro-clienteautocadastro-externo':
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

	$scope.eassociado = function() {

		if ($scope.cliente.associado == true || $scope.cliente.associado == '1') {
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

	//deixei fora da função, pois vou utilizar no cadastro e na listagem
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

	Planospagamento.query(function(pp) {

		$scope.pp = pp;
	}, function(erro) {
		$rootScope.mensagem = {
			erro: 'Não foi possível obter a lista de Planos de Pagamento.'
		};
	});

	if ($rootScope.clienteexterno == true) {
		Situacoescadastro.query({
			'ordem': '1'
		}, function(status) {
			if ($scope.cliente) {
				//if($scope.cliente.status!=undefined){
				$scope.cliente.status = status[0]._id;
				//}
			}

			$scope.status = status;

		}, function(erro) {
			$rootScope.mensagem = {
				erro: 'Não foi possível obter a lista de Status.'
			};
		});
	} else {
		Situacoescadastro.query(function(status) {
			$scope.status = status;
		}, function(erro) {
			$rootScope.mensagem = {
				erro: 'Não foi possível obter a lista de Status.'
			};
		});
	}

	function validaDatasMaioresQueHoje() {
		if (!$scope.cliente) return;
		var endDate = new Date();

		if ($scope.cliente != undefined) {
			if ($scope.cliente.dtnascimento != undefined) {
				if ($scope.cadastrocliente.dtnascimento.$error.invalidDate) {
					$scope.cadastrocliente.dtnascimento.$setValidity("dataMaiorQueHoje", true); //already invalid (per validDate directive)
				} else {
					var startDate = new Date($scope.cliente.dtnascimento);
					$scope.cadastrocliente.dtnascimento.$setValidity("dataMaiorQueHoje", endDate >= startDate);
				}
			}

			if ($scope.cliente.dtfundacao != undefined) {
				if ($scope.cadastrocliente.dtfundacao.$error.invalidDate) {
					$scope.cadastrocliente.dtfundacao.$setValidity("dataMaiorQueHoje", true); //already invalid (per validDate directive)
				} else {

					var startDate = new Date($scope.cliente.dtfundacao);
					$scope.cadastrocliente.dtfundacao.$setValidity("dataMaiorQueHoje", endDate >= startDate);
				}
			}
		}

	}

	//
	function cadastro() {

		Tiposcolaboradores.query(function(tc) {
			$scope.tiposdecolaboradores = tc;
		}, function(erro) {
			$rootScope.mensagem = {
				erro: 'Não foi possível obter a lista de Tipos de Colaborador.'
			};
		});

		$scope.cliente = new Clientes();

		if ($rootScope.clienteexterno == 't') {
			$scope.cliente.associado = '1';
			$scope.cliente.ativo = true;
		}

		buscaestadoscidades();

		if ($stateParams.pai != undefined && $stateParams.pai != '') {

			$scope.cliente.clientepai = $stateParams.pai;
			Clientes.get({
					id: $stateParams.pai
				},
				function(clientepai) {
					$scope.cadastropai = clientepai;
				},
				function(erro) {
					$rootScope.mensagem = {
						erro: 'Cliente não existe.'
					};
					$state.go('cadastros-clientes-lista');

				}
			);
		} else {

			if ($rootScope.clienteexterno == true) {
				if ($rootScope.usuariologado != undefined) {
					$scope.cadastropai = $rootScope.usuariologado[0].usuario;
				}
			}
		}

		$scope.cliente.dtcadastro = new Date();
		$scope.cliente.dtmodificacao = new Date();
		$scope.cliente.ativo = true;
		$scope.cliente.colaborador = [];
		$scope.cliente.contato = [];

		if ($stateParams.id) {

			Clientes.get({
					id: $stateParams.id
				},
				function(cliente) {

					cliente.oldpassword = cliente.password;
					cliente.password = '';

					cliente.dtcadastro = cliente.dtcadastro != undefined ? new Date(cliente.dtcadastro) : new Date();
					cliente.dtmodificacao = cliente.dtmodificacao != undefined ? new Date(cliente.dtmodificacao) : new Date();

					if (cliente.tipopessoa == 'f') {
						if (cliente.dtnascimento != undefined) {
							cliente.dtnascimento = new Date(cliente.dtnascimento);
						}

					} else {
						if (cliente.dtfundacao != undefined) {
							cliente.dtfundacao = new Date(cliente.dtfundacao);
						}

					}

					if (cliente.colaborador == undefined) {
						cliente.colaborador = [];
					}
					if (cliente.contato == undefined) {
						cliente.contato = [];
					}
					$scope.cliente = cliente;

					if (cliente.endereco) {
						if (cliente.endereco.estado != undefined) {
							$scope.buscaestadoscidadesById();
						}
					}

					Clientes.query({
							clientepai: cliente._id
						},
						function(subclientes) {
							$scope.subclientes = subclientes;
						},
						function(erro) {
							console.log(erro);
						}
					);

				},
				function(erro) {
					$rootScope.mensagem = {
						texto: 'Cliente não existe.'
					};
					$state.go('cadastros-clientes-lista');
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

		}

		$scope.$watch('contato', function() {
			console.log('mudou');
		});

		$scope.$watch('cliente.dtnascimento', validaDatasMaioresQueHoje);
		$scope.$watch('cliente.dtfundacao', validaDatasMaioresQueHoje);

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

			//$scope.cliente.contato.push($scope.contato);
			console.log($scope.contato);
			//$scope.contato = '';
		}

	}
	$scope.cancelarContato = function() {
		//$scope.cadastrocliente.telefone.$setValidity("required", true);
		//$scope.cadastrocliente.email.$setValidity("required", true);

		//$scope.cadastrocliente.telefone = '';
		//$scope.cadastrocliente.email.$setViewValue('aaaa');

		//$scope.contato = '';
		$scope.contato.email = '';
		$scope.contato.telefone = '';
		$scope.contato.responsavel = '';
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
		if (
			$scope.cadastrocliente.colaboradorCpf.$isEmpty($scope.cadastrocliente.colaboradorCpf.$viewValue)
		) {

			$scope.cadastrocliente.colaboradorCpf.$setValidity("required", false);
			ir = false;
		} else {
			if ($scope.cadastrocliente.colaboradorCpf.$error.cpf) {
				$scope.cadastrocliente.colaboradorCpf.$setValidity("cpf", false);
				ir = false;
			}
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
		//$scope.cadastrocliente.colaboradorTipo.$setValidity("required", true);
		//$scope.cadastrocliente.colaboradorNome.$setValidity("required", true);
		//$scope.cadastrocliente.colaboradorCpf.$setValidity("required", true);

		$scope.colaborador.colaboradorTipo = '';
		$scope.colaborador.colaboradorNome = '';
		$scope.colaborador.colaboradorCpf = '';
		$scope.colaborador.colaboradorCargo = '';
		$scope.colaborador.colaboradorDtnascimento = '';
		$scope.colaborador.colaboradorTelefone = '';
		$scope.colaborador.colaboradorEmail = '';

		//$scope.colaborador = '';
	}

	$scope.selecionaEnderecoCorrespondencia = function(index) {
		angular.forEach($scope.cliente.endereco, function(field) {
			delete field.correspondencia;
		});
		$scope.cliente.endereco[index].correspondencia = 't';
	}

	function salva() {

		$scope.cliente.dtmodificacao = new Date();

		if ($rootScope.clienteexterno == true) {
			$scope.cliente.externo = true;
		}

		if ($state.current.name == 'cadastros-clientes-editarperfil') {
			$scope.cliente.edicaoperfil = 't'
		} else {
			$scope.cliente.edicaoperfil = 'f'
		}

		$scope.cliente.$save().then(
				function(retorno) {
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

					if ($stateParams.id == undefined && $rootScope.clienteexterno == true) {
						if (cliente.primeirocadastro == 't') {
							$window.location.href = '/cliente/login';
						}
					}

					$state.go('cadastros-clientes-lista');

				}
			)
			.catch(
				function(erro) {
					if (erro.data.code != undefined) {
						if (erro.data.code == 11000) {
							erro.data.message = "Usuário " + $scope.usuario.username + " já está em uso.";
						}
					}

					$scope.cadastrocliente.username.$setValidity("required", false);
					$rootScope.mensagem = {
						erro: 'Não foi possível salvar: ' + erro.data.message
					};
				}
			);
	}

	$scope.salvarCliente = function() {

		var salvarform = $scope.cadastrocliente.$valid;
		var salvarformcontato = true;

		/*angular.forEach($scope.cadastrocliente.$error, function (field, fieldName) {
				if( fieldName[ 0 ] === '$' ) {
					return;
				}
				console.log(fieldName);
				var fieldValue = field.$viewValue;
				console.log(fieldValue);
			});
			*/
		if ($scope.cliente.contato.length <= 0) {

			$scope.cadastrocliente.telefone.$setValidity("required", false);
			$scope.cadastrocliente.email.$setValidity("required", false);

			salvarformcontato = false;
		}

		if (salvarform && salvarformcontato) {
			$rootScope.mensagem = {
				erro: ''
			};
			salva();

		} else {
			$rootScope.mensagem = {
				erro: 'Preencha os campos obrigatórios.'
			};
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

	$scope.cadastrarRepresentado = function() {
		var pai = $scope.cliente._id;
		$state.go("cadastros-clientes-novo", {
			pai: pai
		});
	}

	function clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}

	$scope.copiarParaCobranca = function() {
		var endereco = clone($scope.cliente.endereco[0]);
		$scope.cliente.endereco[1] = endereco
	}
});
