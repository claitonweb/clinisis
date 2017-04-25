app.controller('AtendimentosCompraCtrl', function($location, $rootScope, $scope, $routeParams, 
	$stateParams, $state, $filter, $window, $resource, Api, Notification, 
	$uibModal, $document) {
	
	$scope.config = {
		module: {
			name: 'atendimentos',
			desc: 'Atendimentos'
		},
		resource: {
			name: 'compra',
			desc: 'Compra'
		},
		states: {
			lista: {},
			cadastro: {},
			visualizar: {}
		},
		redirectSaveToState: "lista",
		listCols: [
			{
				name: "codigo",
				desc: "Código"
			},
			{
				name: "cliente",
				desc: "Cliente",
				subname : 'nome'
			},
			{
				name: "data_atendimento",
				desc: "Dt Atendimento"
			}
			
		],
		fields: {
			nome: {}
		}
	};
	
	var $ctrl = this;
  	
  	$scope.openModal = function(){
		$scope.titulo = 'Agendamento para compra ';	 
		var parentElem = angular.element($document[0].querySelector('.modal-demo'));
		$uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      controllerAs: '$ctrl',
	      size: 'lg',
	      appendTo: parentElem,
	      resolve: {
		        escopo : function(){
		        	return $scope;
		        },
		        objnotification : function(){
		        	return Notification;
		        }

		   }
	    });
	}
	$scope.agendar = function(obj){
		$scope.modelObj = new Api.atendimentos.consulta();
		//$scope.modelObj = angular.copy(obj);
		$scope.modelObj.objcompra = angular.copy(obj);
		$scope.modelObj.compra = angular.copy(obj.compra);
		
		$scope.modelObj.saida = obj._id;
		$scope.modelObj.data_atendimento = new Date();
		$scope.modelObj.status = 'AG';

		$scope.openModal();
		
		
	}


	$scope.buscapaciente = function (){
		if($scope.modelObj.nomepacientepesquisa.length > 3){
			
			$scope.clientes = BaseCtrl.getAll(Api.cadastros.cliente,{pesquisaunica : $scope.modelObj.nomepacientepesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.clientes = '';
				}
			});
		}else{
			$scope.clientes = '';
		}
	}
	$scope.selecionapaciente = function(paciente){
		$scope.modelObj.cliente = paciente._id;
		$scope.modelObj.nomepacientepesquisa = paciente.nome;
		$scope.modelObj.medico = paciente.medico;
		$scope.clientes = [];
	}

	$scope.buscavacina = function (){
		
		if($scope.modelObj.nomevacinapesquisa.length >= 3){
			
			$scope.vacinas = BaseCtrl.getAll(Api.estoque.vacina,{pesquisaunica : $scope.modelObj.nomevacinapesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.vacinas = '';
				}
			});
		}else{
			$scope.vacinas = '';
		}
	}
	
	$scope.buscapacote = function (){
		
		if($scope.modelObj.nomepacotepesquisa.length > 3){
			
			$scope.pacotes = BaseCtrl.getAll(Api.estoque.pacotevacinal,{pesquisaunica : $scope.modelObj.nomepacotepesquisa},function(retorno){
				if(retorno.length == 0){
					$scope.pacotes = '';
				}
			});
		}else{
			$scope.pacotes = '';
		}
	}
	
	$scope.adicionarpacote = function(pacote){
		angular.forEach(pacote.vacinas,function(values, key){
			
			BaseCtrl.getAll(Api.estoque.vacina,{_id : values},function(retorno){
				$scope.adicionarvacina(retorno[0]);
			});
			
		});
	}
	
	$scope.total = 0;
	$scope.saldo = 0;
	
	$scope.calculasaldo = function(){
		
		$scope.saldo = 0;
		var totpagamentos = 0;
		angular.forEach($scope.modelObj.pagamentos,function(values, key){
			totpagamentos+= values.valor;
		});
		
		$scope.saldo = $scope.total - totpagamentos;
		$scope.modelObj.valorpgto = $scope.saldo;
	}
	
	$scope.adicionarvacina = function(vacina){
		
		var qtd = $scope.modelObj.qtdvacinapesquisa;
		if(qtd == '' || qtd == undefined || qtd < 1){
			qtd = 1;
		}
		BaseCtrl.getAll(Api.estoque.lancamento,{vacina : vacina._id},function(retorno){
			if(retorno.length > 0){
				
				


				for (var i = 1; i <=qtd; i++) {
					var vac = angular.copy(vacina);			
					var obj = {
							vacina : vac._id,
							valor : vac.valor_venda,
							quantidade : 1,
							objvacina : vac
					}
					obj.lancamento = retorno[0];
					$scope.modelObj.vacinas.push(obj);
					$scope.total = $scope.total+vac.valor_venda;
					$scope.calculasaldo();	
				}

				$scope.modelObj.idformapagamento = $scope.formaspagamento[0]._id;
				
			}
		});
		
		
		
		
	}
	
	$scope.removerVacina = function(index){
		var vac  = $scope.modelObj.vacinas[index];
		//console.log(vac);
		$scope.modelObj.vacinas.splice(index,1);
		
		$scope.total = $scope.total-vac.valor_venda;
		//$scope.calculasaldo();
		$scope.calculasaldo();
		$scope.atualizarValores();
	}

	$scope.arrayformaspagamento = [];
	
	$scope.externatoogle = function (){
		if($scope.modelObj.externa == 1){
			$scope.modelObj.externa = 0;
			$scope.config.resource.desc = "Compra";
		}else{
			$scope.config.resource.desc = "Compra Externa";
			$scope.modelObj.externa = 1;
		}


	}

	$scope.beforeCadastro = function() {
		
		

		$scope.paciente = '';
		$scope.pagamentos = [];
		$scope.medicos = BaseCtrl.getAll(Api.cadastros.medico);
		$scope.formaspagamento = BaseCtrl.getAll(Api.admconfs.formaspagamento);
		$scope.periodos = [
		{
			_id : 0,
			nome : ''
		},
		{
			_id : 10,
			nome : '10 dias'
		},
		{
			_id : 15,
			nome : '15 dias'
		},
		{
			_id : 20,
			nome : '20 dias'
		},
		{
			_id : 30,
			nome : '30 dias'
		},
		{
			_id : 45,
			nome : '45 dias'
		},
		{
			_id : 60,
			nome : '60 dias'
		},
		
		];



		if($location.search().cliente!=undefined){
			var cliente = $location.search().cliente;
			$scope.cliente = BaseCtrl.getAll(Api.cadastros.cliente,{_id : cliente},function(retorno){
					if(retorno.length > 0){
						$scope.modelObj.cliente = retorno[0]._id;
						$scope.modelObj.nomepacientepesquisa = retorno[0].nome;
						$scope.modelObj.medico = retorno[0].medico
					}
			});
		}else{
			if($rootScope.usuariologado != undefined){
				if($rootScope.usuariologado[0].estrategia == 'localCliente'){
					$scope.modelObj.cliente = $rootScope.usuariologado[0].usuario._id;
					$scope.modelObj.nomepacientepesquisa = $scope.usuariologado[0].usuario.nome;
					$scope.modelObj.medico = $rootScope.usuariologado[0].usuario.medico
				}		
			}
				
		}

	};

	$scope.atualizarValores =  function(ret){
		$scope.total = 0;
		if(ret == undefined || ret == ''){
			angular.forEach($scope.modelObj.vacinas,function(values, key){
				$scope.total+= values.valor;

			});
		}else{
			
			angular.forEach(ret.vacinas,function(values, key){
				$scope.total+= values.valor;
			});
		}
		$scope.calculasaldo();
		
	
	};

	$scope.afterCadastro = function(){
		
		if($scope.modelObj.cliente!=undefined){
			$scope.modelObj.nomepacientepesquisa = $scope.modelObj.cliente.nome;	
		}
		if($scope.modelObj.medico != undefined){
			$scope.modelObj.medico = $scope.modelObj.medico._id;	
		}
		
		if($scope.modelObj.externa == undefined){
			$scope.modelObj.externa = 0;
		}
		

		$scope.atualizarValores();

		angular.forEach($scope.modelObj.pagamentos, function(value, key){
			$scope.pagamentos.push({
							formapagamento : value.formapagamento,
							valor : value.valor,
							data_pagamento : value.data_pagamento
			});
		});

		$scope.calculasaldo();
	}
	
	$scope = BaseCtrl.build($rootScope, $scope, $state, $stateParams, Api);
	
	
	if($scope.modelObj!=undefined){
		$scope.modelObj.vacinas = [];
		$scope.modelObj.pagamentos = [];
		$scope.pagamentos = [];
		$scope.modelObj.datavencimento = new Date();
		$scope.modelObj.qtdvacinapesquisa = 1;
	}
	
	
	
	$scope.data_vencimento = {};
	$scope.data_vencimento.opened = false;
	
	
	
	$scope.adicionarpagamento = function (){
		var formapagamento = $scope.modelObj.idformapagamento;
		var valor = $scope.modelObj.valorpgto;
		var dtpagamento = $scope.modelObj.datavencimento;
		if($scope.modelObj.periodo!=undefined){
			var dias = $scope.modelObj.periodo;
			var dtpagamento = new Date(dtpagamento);
	        dtpagamento.setUTCDate(dtpagamento.getDate() + dias);	
		}

		var qtdparcelas = $scope.modelObj.qtdparcela;

		if(qtdparcelas==undefined || qtdparcelas<=0){
			qtdparcelas  = 1;
		}
		
		var valordividido = valor / qtdparcelas;

		for (var i = 1; i <= qtdparcelas; i++) {
			if(valordividido <= $scope.saldo){
				$scope.modelObj.pagamentos.push({
					formapagamento : formapagamento,
					valor : valordividido,
					data_pagamento : dtpagamento
				});
				
				$scope.calculasaldo();
				
				angular.forEach($scope.formaspagamento,function(values, key){
					if(values._id == formapagamento){
						$scope.pagamentos.push({
							formapagamento : values,
							valor : valordividido,
							data_pagamento : dtpagamento
						});
					}
				});

				if($scope.modelObj.periodo!=undefined){
					var dias = $scope.modelObj.periodo;
					var dtpagamento = new Date(dtpagamento);
	            	dtpagamento.setUTCDate(dtpagamento.getDate() + dias);	
				}
				
            
				

			}	
		}
		

	}
	

	
	$scope.removerPagamento = function(index){
		$scope.modelObj.pagamentos.splice(index,1);
		$scope.pagamentos.splice(index,1);
		$scope.calculasaldo();

		
		//$scope.total = $scope.total-vac.valor_venda;
	}
	
	$scope.pagar = function(){
			var id = '5890e18e29d75f9818715526';
            $resource('/pagseguro/:id').get(
                {id : id},
                function(retorno) {
                    var code = retorno.checkout.code[0];
                    console.log(code);
                    PagSeguroLightbox({
                        code: code
                    }, {
                        success : function(transactionCode) {
						},
                        abort : function() {
                            //alert("abort");
                        }
                    });

                    console.log(retorno);
                },
                function(erro) {
                    $rootScope.mensagem = {
                        texto: 'Não existe.'
                    };

                }
            );


        };

	$scope.salvar = function(){
		var vai = true;
		$rootScope.mensagem = {};
		
		if(vai){
			if($scope.modelObj.cliente == '' || $scope.modelObj.cliente == undefined){
				$scope.mensagem = {
						erro: 'Selecione um cliente.'
				};
				vai = false;
			}
		}
		
		if(vai){
			if($scope.modelObj.vacinas.length <=0){
				$scope.mensagem = {
						erro: 'Selecione ao menos uma vacina.'
				};
				vai = false;
			}
		}
		if(vai){
			/*if($scope.saldo > 0){
				$scope.mensagem = {
						erro: 'Saldo maior que zero, informe o meio de pagamento.'
				};
				vai = false;
			}*/
		}
		
		
		if(vai){
			var externa = angular.copy($scope.modelObj.externa);

			$scope.modelObj.$save()
			.then(
				function() {
					$scope.mensagem = {
						texto: 'Salvo com sucesso'
					};

					if(externa == 1){
						$state.go('atendimentos-compra-externa-lista');
					}else{
						$state.go('atendimentos-compra-lista');	
					}

					
				}
			)
			.catch(
				function(erro) {
					$scope.mensagem = {
						erro: 'Não foi possível rejeitar'
					};
				}
			);
		}
	}

	$scope.excluircompra = function(compra){

		var confirma = confirm('Tem certeza? Essa operação não poderá ser desfeita!');

		if(confirma){
			var obj = new Api.atendimentos.compra();

			obj.$delete({id : compra._id})
				.then(
					function() {
						$scope.mensagem = {
							texto: 'Deletado com sucesso'
						};
						$scope.lista({});
					}
				)
				.catch(
					function(erro) {
						$scope.mensagem = {
							erro: 'Não foi possível rejeitar'
						};
					}
				);	
		}
	}

    $scope.maximo = 10;
    $scope.load = function(){
    	if($scope.compras != undefined){
    		
    		Notification({message: 'Carregando',replaceMessage: true, positionY: 'bottom', positionX: 'left'}, 'info');
    		
    		var total = $scope.compras.length;
	    	if($scope.maximo < total){
	    		var soma = 0;
				var maximo = angular.copy($scope.maximo);
	    		
	    		for(var i = 0; i < 10; i++) {
	    			soma = soma + 1;
	    			if((maximo + soma) >= total){
	    				break;
	    			}
	    		}
	    		

	    		$scope.maximo = $scope.maximo + soma;	
	    	}	
    	}
    }

	$scope.lista = function(searchParams){
		var compras = [];
		
		if(searchParams!=undefined){
			
			Notification({message: 'Carregando',delay : 500000 ,replaceMessage: true, positionY: 'bottom', positionX: 'left'}, 'info');
		
			$scope.searchParams = angular.copy(searchParams);
			var vai = true;
			var statuspgto = false;

			if(searchParams.nome!=undefined && searchParams.nome!=''){
				vai = true;
			}
			
			if(searchParams.codigo!=undefined && searchParams.codigo!=''){
				vai = true;
			}

			if(searchParams.status!=undefined && searchParams.status!=''){
				statuspgto = searchParams.status;
				delete searchParams.status;
			}

			searchParams.externa = 0;
			//console.log(searchParams);

			if(vai){

				BaseCtrl.getAll(Api.atendimentos.consulta,{naousardata : true}, function(atendimentos){
					BaseCtrl.getAll(Api.estoque.saidas,searchParams,function(retorno){
					
					$scope.compras = retorno;
					if(retorno.length < $scope.maximo){
						$scope.maximo = retorno.length;
					}
					angular.forEach(retorno, function(value, key){


						if(value.compra!=undefined && value.compra.cupom){
							Api.atendimentos.cupom.get({id : value.compra.cupom},function(cupom){
								//console.log(cupom);
								if(retorno[key]!=undefined && retorno[key].compra!=undefined){
									retorno[key].compra.cupom = cupom;	
								}
								
							})
						}

						//$scope.atendimentos = BaseCtrl.getAll(Api.atendimentos.consulta,{naousardata : true});

						if(value.compra!=undefined && value.compra.pagamentos.length > 0 && value.compra.cliente!=undefined){
							if(value.compra.pagamentos[0].pagseguro!=undefined){
								
								if(value.compra.pagamentos[0].retorno == undefined || 
									value.compra.pagamentos[0].retorno.transaction.status[0] == 1
								){
									var transactionCode = value.compra.pagamentos[0].pagseguro;
									$resource('/pagseguro/transactions/:transactionCode').get(
						                {transactionCode : transactionCode},
						                function(retornoP) {
						                	value.compra.pagamentos[0].retorno = retornoP
						                	
						                	var model = new Api.atendimentos.compra();
						                	copia = angular.copy(value.compra);
						                	copia.cliente = copia.cliente._id;
						                	copia.pagamentos[0].formapagamento = value.compra.pagamentos[0].formapagamento._id; 
						                	delete copia.pagamentos[0].retorno.$promise;
						                	delete copia.pagamentos[0].retorno.$resolved;

						                	model = angular.merge(model,copia);
						                	//console.log(model);
						                	model.$save().then(function(retornosave) {
													console.log('salvou retorno do pagseguro ', retornosave);

											});
						                	
						                },
						                function(erro) {
						                    $rootScope.mensagem = {
						                        texto: 'Não existe.'
						                    };
										}
					        		);	
								}

								
							}
						}

						angular.forEach(atendimentos, function(valuea, keya){
							//console.log(valuea);
							if(valuea.saida!=undefined){
								if(valuea.saida._id == value._id){
									retorno[key].jatem = true;
									retorno[key].atendimento = valuea;
								}else{
									
								}	
							}
						});

						
						
						if(statuspgto){
								if(statuspgto == 3){ //pago 
									if(value.compra.pagamentos.length <= 0 || value.compra.pagamentos == undefined){
										retorno[key].compra = undefined;
										//retorno.splice(5,1);
									}else{
										if(value.compra.pagamentos[0].retorno!=undefined){
											if(value.compra.pagamentos[0].retorno.transaction.status[0] != 3){
												retorno[key].compra = undefined;
											}
										}
									}
								}
									
								if(statuspgto == 1){ //aguardando
									
									if(value.compra.pagamentos.length > 0 || value.compra.pagamentos == undefined){
										if(value.compra.pagamentos[0].retorno!=undefined){
											if(value.compra.pagamentos[0].retorno.transaction.status[0] != 1){
												retorno[key].compra = undefined;
											}
										}else{
											retorno[key].compra = undefined;
										}	
									}
								}
						}
						//console.log('adicionar', value);
						//compras.push[value];
						
						//console.log($scope.compras);
						
						Notification.clearAll();

					});				
					

					//console.log($scope.compras);

					

				});	
			});
				
		}
				
	}
			
	}	

	if($state.current.name == 'atendimentos-compra-lista'){
		$scope.lista({});
	}

	$scope.alerta = function(){
		alert('a');
	}

})
.controller('ModalInstanceCtrl', function ($uibModalInstance, escopo, objnotification) {
  var $ctrl = this;
  $ctrl.escopo = escopo;

  $ctrl.ok = function () {
   

	var vai = true;
	if(vai){
		if($ctrl.escopo.modelObj.cliente == '' || $ctrl.escopo.modelObj.cliente == undefined){
			objnotification({message: 'Selecione um cliente',replaceMessage: true, positionY: 'top', positionX: 'right'}, 'error');
			vai = false;
		}
	}
	if(vai){
			$ctrl.escopo.modelObj.$save()
			.then(
				function() {
					objnotification({message: 'Agendado com sucesso',replaceMessage: true, positionY: 'top', positionX: 'right'}, 'success');
					$ctrl.escopo.lista({});
					$uibModalInstance.close();
				}
			)
			.catch(
				function(erro) {
					objnotification({message: 'Não foi possivel salvar',replaceMessage: true, positionY: 'top', positionX: 'right'}, 'error');
				}
			);
		}
	

  }; //fim $ctrl.ok

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
