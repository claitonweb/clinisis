app.run(function(AclService, $resource, $state, $rootScope, $window, Api) {

	$rootScope.menus = menus;
	
	var roles = [];

	for (var modName in loadModules) {
			
		for (var resInd in loadModules[modName]) {
			var resName = loadModules[modName][resInd];
			var lowerMod = modName.toLowerCase();
			var lowerRes = resName.toLowerCase();
			
			if (!AclService.hasResource(lowerMod + '-' + lowerRes + '-lista')) {
				AclService.addResource(lowerMod + '-' + lowerRes + '-lista');
			}

			if (!AclService.hasResource(lowerMod + '-' + lowerRes + '-cadastro')) {
				AclService.addResource(lowerMod + '-' + lowerRes + '-cadastro');
			}
		}
	}

	//PEGA TODOS OS RESOURCES
	Api.acl.resource.query(
		function(retorno) {
			angular.forEach(retorno, function(value, key) {
				if (!AclService.hasResource(value.state)) {
					AclService.addResource(value.state);
				}
			});




			if(externo){
				var res = $resource('/cliente/verificalogado');
			}else{
				var res = $resource('/usuario/verificalogado');
			}

			//AQUI RETORNA AS PERMISSÕES DO USUÁRIO LOGADO
			res.query(
				function(usuario) {
					
					$rootScope.usuariologado = usuario;
				    
					if(externo){

						var role = 'cliente';

					}else{
						var role = 'admin';
					}


					
					AclService.addRole(role);

					//SEMPRE DA PERMISSÃO TOTAL AO RESOURCE
					/*angular.forEach(usuario[0].retorno.resources, function(value, key) {
						AclService.allow(role, value.state);
					});*/

					for (var modName in loadModules) {
			
						for (var resInd in loadModules[modName]) {
							var resName = loadModules[modName][resInd];
							var lowerMod = modName.toLowerCase();
							var lowerRes = resName.toLowerCase();
						
							AclService.allow(role, lowerMod + '-' + lowerRes + '-lista');
							AclService.allow(role, lowerMod + '-' + lowerRes + '-cadastro');
							
						}
					}



					if(externo){

						var user = {
							id: usuario[0].usuario._id,
							name: usuario[0].usuario.nome,
							getRoles: function() {
								return [role];
							},
						};

					}else{
						var user = {
							id: usuario[0].user.usuario._id,
							name: usuario[0].user.usuario.nome,
							getRoles: function() {
								return [role];
							},
						};
					}
					

					console.log(user);

					AclService.setUserIdentity(user);
					$rootScope.podeincluir = true;
				},
				function(erro) {

					console.log('Erro ao verificar login para pegar os resources');
					//console.log(erro);
					//$window.location.href = '/';
				}
			);
		},
		function(erro) {
			console.log('Erro ao obter resources');
			console.log(erro);
		}
	);
});
