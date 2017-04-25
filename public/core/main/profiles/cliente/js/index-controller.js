app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $stateParams, $state, filterFilter, Api) {

	var vm = $scope;
	$scope.id = $stateParams.id;

	$rootScope.mensagem = {
		texto: ''
	};

	$scope.comprarcupom = function(){
		var codigo = $scope.codigo;
		var cod = codigo.split('/');
		
		BaseCtrl.getAll(Api.atendimentos.cupom,{codigo_cupom : cod[1], codcupom : cod[0]},function(retorno){
			
			if(retorno.length == 1){
					
				$state.go('atendimento-compracupom-cadastro',{id : retorno[0]._id});

				/*var searchParams = {};
				var qtdmaximapessoas = retorno[0].quantidade_usuario;
				
				var qtdmaximavendas = retorno[0].quantidade;
				var qtdjavendidas = 0;
				var qtdjavendidasparaessecliente = 0;

				searchParams.cupom = retorno[0]._id;
				

				BaseCtrl.getAll(Api.atendimentos.compra,searchParams,function(comprascupom){
					if(comprascupom.length > 0){
						
						angular.forEach(comprascupom, function(value, key){
							angular.forEach(value.vacinas, function(vacina, key){
								if(vacina._id == retorno[0].vacina._id){
									qtdjavendidas = qtdjavendidas + 1;
								}		
							});	
						});

						if(qtdjavendidas < qtdmaximavendas){
							searchParams.cliente = $scope.usuariologado[0].usuario._id;
							BaseCtrl.getAll(Api.atendimentos.compra,searchParams,function(compras){
								if(compras.length > 0){

									angular.forEach(compras, function(value, key){
										angular.forEach(value.vacinas, function(vacina, key){
											if(vacina._id == retorno[0].vacina._id){
												qtdjavendidasparaessecliente = qtdjavendidasparaessecliente + 1;
											}		
										});
									});

									if(qtdjavendidasparaessecliente < qtdmaximapessoas){
										//segue
									}

								}else{
									// segue
								}	
							
								
							});	
						}
						

					}else{

						//segue
					}	
				
					
				});	
				*/
					
			}else{
				//cupom não encontrado
			}
			
		});
	}
});
