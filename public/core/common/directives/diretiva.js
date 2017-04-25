integra
	.directive('teste', ['', function() {
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {

			}
		};
}])

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('formularioAbaUnica', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			descricao: '@'
		},
		template: '<form id="form" method="POST">' +
			'<div class="g2ui-painel-vertical no-scroll">' +
			'<div class="g2ui-tabs">' +
			'<ul>' +
			'<li>' +
			'<a href="#abaUnica">{{this.descricao}}</a>' +
			'</li>' +
			'</ul>'

			+
			'<div id="abaUnica" class="aba">' +
			'<div ng-transclude></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</form>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('formulario', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="g2ui-painel-vertical">' +
			'<form id="form" method="POST" ng-transclude></form>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// ABAS NO FORMATO JQUERY-UI
//--------------------------------------------------------------------------------------------
.directive('abas', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: function($scope, $element) {
			var abas = $scope.abas = [];

			/*
			$scope.select = function(aba) {
				angular.forEach(abas, function(aba) {
				aba.selected = false;
			});
			aba.selected = true;
		};

		this.addAba = function(aba) {
			if (abas.length == 0)
			$scope.select(aba);
			abas.push(aba);
		};*/
		},
		template: '<div class="g2ui-tabs" ng-transclude>' +
			'<ul>' +
			'<li ng-repeat="aba in abas" ng-class="{active: aba.selected}">' +
			'<a href="#{{aba.id}}" ng-click="select(aba)">{{aba.descricao}}</a>' +
			'</li>' +
			'</ul>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// NAV + PAINEL DE ABA NO FORMATO JQUERY-UI, DEPENDENTE DO COMPONENTE <ABAS>
//--------------------------------------------------------------------------------------------
.directive('aba', function() {
	return {
		require: '^abas',
		restrict: 'E',
		transclude: true,
		scope: {
			id: '@',
			descricao: '@'
		},
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.addAba(scope);
		},
		template: '<div class="aba" ng-class="{active: selected}" ng-transclude>' +
			'<div class="clear"></div>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// ACCORDION NO FORMATO JQUERY-UI COM UM PAINEL PADRÃO DE FILTROS PARA TELA DE CONSULTA
//--------------------------------------------------------------------------------------------
.directive('filtros', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			appendclass: '@'
		},
		template: '<div class="g2ui-accordion{{this.appendclass}}">' +
			'<h3>Filtros</h3>'

			+
			'<div>' +
			'<div ng-transclude></div>'

			+
			'<div class="clear"></div>'

			+
			'<div class="divBotoes" style="padding-top: 20px;">' +
			'<a id="btn_pesquisar">Pesquisar</a>' +
			'<a id="btn_limpar">Limpar Filtros</a>' +
			'</div>'

			+
			'<div class="clear"></div>' +
			'</div>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// DIV PADRÃO PARA A BARRA INFERIOR DO LAYOUT
//--------------------------------------------------------------------------------------------
.directive('barrainferior', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div id="barraInferior">' +
			'<div class="btnForm" style="padding: 7px 12px 0 0;">' +
			'<div class="divBotoes" ng-transclude></div>' +
			'</div>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// CONTAINER PARA CONJUNTOS DE CAMPOS (UL PARA OS CONJUNTOS EM LI)
//--------------------------------------------------------------------------------------------
.directive('conjuntos', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: function($scope, $element) {
			var abas = $scope.abas = [];

			/*
			$scope.select = function(aba) {
			angular.forEach(abas, function(aba) {
			aba.selected = false;
		});
		aba.selected = true;
	};
	*/

			this.addAba = function(aba) {
				/*if (abas.length == 0)
				$scope.select(aba);*/
				abas.push(aba);
			};
		},
		template: '<ul class="conjuntos" ng-transclude></ul>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// CONJUNTO DE CAMPOS (LI), DEPENDENTE DO COMPONENTE <CONJUNTOS> (UL)
//--------------------------------------------------------------------------------------------
.directive('conjunto', function() {
	return {
		require: '^conjuntos',
		restrict: 'E',
		transclude: true,
		scope: {
			titulo: '@',
		},
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.addAba(scope);
		},
		template: '<li class="conjunto" ng-transclude>' +
			'<h2>{{this.titulo}}</h2>' +
			'</li>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// DIV PADRÃO PARA LINHA DE CAMPOS
//--------------------------------------------------------------------------------------------
.directive('linha', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="linhaBloco">' +
			'<div ng-transclude></div>' +
			'<div class="clear"></div>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('left', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div style="float: left" ng-transclude></div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('right', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div style="float: right" ng-transclude></div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('clear', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="clear"></div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('botao', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<a class="button" ng-transclude></a>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('dialogo', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="container_21 inputFormat" style="display: none" ng-transclude></div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('avisoInformacao', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="ui-widget ui-state-default ui-corner-all" style="margin: 5px; padding: 10px;">' +
			'<span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-info"></span>' +
			'<p style="padding-top: 3px;" ng-transclude></p>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('avisoSucesso', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="ui-widget ui-state-default ui-corner-all" style="margin: 5px; padding: 10px;">' +
			'<span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-check"></span>' +
			'<p style="padding-top: 3px;" ng-transclude></p>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('avisoAtencao', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="ui-widget ui-state-highlight ui-corner-all" style="margin: 5px; padding: 10px;">' +
			'<span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-info"></span>' +
			'<p style="padding-top: 3px;" ng-transclude></p>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('avisoErro', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="ui-widget ui-state-error ui-corner-all" style="margin: 5px; padding: 10px;">' +
			'<span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-alert"></span>' +
			'<p style="padding-top: 3px;" ng-transclude></p>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('tabela', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: function($scope, $element) {
			var ths = $scope.abas = [];
			var trs = $scope.abas = [];

			this.adicionarTh = function(aba) {
				ths.push(aba);
			};

			this.adicionarTr = function(aba) {
				trs.push(aba);
			};
		},
		template: '<table class="ui-widget tabela-listagem tabela_zebrada">' +
			'<tbody>' +
			'<li ng-repeat="aba in abas">' +
			'<a href="#{{aba.idAba}}">{{aba.labelAba}}</a>' +
			'</li>' +
			'</tbody>' +
			'</table>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('cabecalhoTabela', function() {
	return {
		require: '^tabela',
		restrict: 'E',
		transclude: true,
		scope: {
			labelAba: '@',
			idAba: '@'
		},
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.adicionarTh(scope);
		},
		template: '<th ng-transclude></th>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('linhaTabela', function() {
	return {
		require: '^tabela',
		restrict: 'E',
		transclude: true,
		scope: {
			labelAba: '@',
			idAba: '@'
		},
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.adicionarTr(scope);
		},
		template: '<tr ng-transclude></tr>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// CELULAS = GRIDS
//--------------------------------------------------------------------------------------------
.directive('celula', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			tamanho: '@'
		},
		template: '<div class="grid_{{this.tamanho}}" ng-transclude></div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('caixa', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			descricao: '@'
		},
		template: '<div class="ui-widget ui-widget-content ui-corner-all" ng-transclude>' +
			'<div class="ui-widget-header ui-corner-all">{{this.descricao}}</div>' +
			'</div>',
		replace: true
	};
})

;

.directive('formularioAbaUnica', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			descricao: '@'
		},
		template: '<form id="form" method="POST">' +
			'<div class="jet-ui-painel-vertical no-scroll">' +
			'<div class="jet-ui-tabs">' +
			'<ul>' +
			'<li>' +
			'<a href="#abaUnica">{{this.descricao}}</a>' +
			'</li>' +
			'</ul>'

			+
			'<div id="abaUnica" class="aba">' +
			'<div ng-transclude></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</form>',
		replace: true
	};
})

.directive('formulario', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="jet-ui-painel-vertical">' +
			'<form id="form" method="POST" ng-transclude></form>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// ABAS NO FORMATO JQUERY-UI
//--------------------------------------------------------------------------------------------
.directive('jet-abas', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {},
			controller: function($scope, $element) {
				var abas = $scope.abas = [];

				this.addAba = function(aba) {
					abas.push(aba);
				};
			},
			template: '<div class="jet-ui-tabs" ng-transclude>' +
				'<ul>' +
				'<li ng-repeat="aba in abas" ng-class="{active: aba.selected}">' +
				'<a href="#{{aba.id}}" ng-click="select(aba)">{{aba.descricao}}</a>' +
				'</li>' +
				'</ul>' +
				'</div>',
			replace: true
		};
	})
	.directive('aba', function() { // NAV + PAINEL DE ABA NO FORMATO JQUERY-UI, DEPENDENTE DO COMPONENTE <ABAS>
		return {
			require: '^abas',
			restrict: 'E',
			transclude: true,
			scope: {
				id: '@',
				descricao: '@'
			},
			link: function(scope, element, attrs, tabsCtrl) {
				tabsCtrl.addAba(scope);
			},
			template: '<div class="aba" ng-class="{active: selected}" ng-transclude>' +
				'<div class="clear"></div>' +
				'</div>',
			replace: true
		};
	})

//--------------------------------------------------------------------------------------------
// ACCORDION NO FORMATO JQUERY-UI COM UM PAINEL PADRÃO DE FILTROS PARA TELA DE CONSULTA
//--------------------------------------------------------------------------------------------
.directive('accordion', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			descricao: '@'
		},
		template: '<div class="jet-ui-accordion">' +
			'<h3>{{this.descricao}}</h3>' +
			'<div ng-transclude></div>' +
			'</div>',
		replace: true
	};
})

.directive('filtros', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="jet-ui-accordion">' +
			'<h3>Filtros</h3>'

			+
			'<div>' +
			'<div ng-transclude></div>'

			+
			'<div class="clear"></div>'

			+
			'<div class="divBotoes" style="padding-top: 20px;">' +
			'<a id="btn_pesquisar">Pesquisar</a>' +
			'<a id="btn_limpar">Limpar Filtros</a>' +
			'</div>'

			+
			'<div class="clear"></div>' +
			'</div>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// DIV PADRÃO PARA A BARRA INFERIOR DO LAYOUT
//--------------------------------------------------------------------------------------------
.directive('barrainferior', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div id="barraInferior">' +
			'<div class="btnForm" style="padding: 7px 12px 0 0;">' +
			'<div class="divBotoes" ng-transclude></div>' +
			'</div>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// CONTAINER PARA CONJUNTOS DE CAMPOS (UL PARA OS CONJUNTOS EM LI)
//--------------------------------------------------------------------------------------------
.directive('conjuntos', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<ul class="conjuntos" ng-transclude></ul>',
		replace: true
	};
})

.directive('conjunto', function() { // CONJUNTO DE CAMPOS (LI), DEPENDENTE DO COMPONENTE <CONJUNTOS> (UL)
	return {
		require: '^conjuntos',
		restrict: 'E',
		transclude: true,
		scope: {
			titulo: '@',
		},
		template: '<li class="conjunto" ng-transclude>' +
			'<h2>{{this.titulo}}</h2>' +
			'</li>',
		replace: true
	};
})

.directive('subconjunto', function() {
	return {
		require: '^conjunto',
		restrict: 'E',
		transclude: true,
		scope: {
			titulo: '@',
		},
		template: '<div class="subconjunto" ng-transclude>' +
			'<h3 class="sub-titulo">{{this.titulo}}</h3>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// DIV PADRÃO PARA LINHA DE CAMPOS
//--------------------------------------------------------------------------------------------
.directive('bloco', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="linhaBloco">' +
			'<div ng-transclude></div>' +
			'<div class="clear"></div>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('left', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div style="float: left" ng-transclude></div>',
		replace: true
	};
})

.directive('right', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div style="float: right" ng-transclude></div>',
		replace: true
	};
})

.directive('clear', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="clear"></div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('botao', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<a class="button" ng-transclude></a>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('dialogo', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="container_21 inputFormat" style="display: none" ng-transclude></div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('aviso', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			tipo: '@'
		},
		link: function(scope, element, attrs, setCtrl) {
			switch (attrs.tipo) {
				case 'atencao':
					scope.divclass = 'ui-state-highlight';
					scope.iconclass = 'ui-icon-info';
					break;

				case 'erro':
					scope.divclass = 'ui-state-error';
					scope.iconclass = 'ui-state-alert';
					break;

				case 'sucesso':
					scope.divclass = 'ui-state-active';
					scope.iconclass = 'ui-icon-check';
					break;

				case 'info':
				default:
					scope.divclass = 'ui-state-default';
					scope.iconclass = 'ui-icon-info';
					break;
			}
		},
		template: '<div class="ui-widget {{this.divclass}} ui-corner-all" style="margin: 5px; padding: 10px;">' +
			'<span style="float: left; margin-right: .3em;" class="ui-icon {{this.iconclass}}"></span>' +
			'<p style="padding-top: 3px;" ng-transclude></p>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
//	.directive('tabela', function() {
//		return {
//			restrict : 'E',
//			transclude : true,
//			scope : {},
//			controller : function($scope, $element) {
//				var ths = $scope.ths = [];
//				var trs = $scope.trs = [];
//
//				this.adicionarTh = function(th) {
//					ths.push(th);
//				};
//
//				this.adicionarTr = function(tr) {
//					trs.push(tr);
//				};
//			},
//			template :
//				'<table class="ui-widget tabela-listagem tabela_zebrada" ng-transclude>'
//				+ '</table>',
//			replace : true
//		};
//	})
//	.directive('cabecalho', function() {
//		return {
//			require : '^tabela',
//			restrict : 'E',
//			transclude : true,
//			scope : {
//				labelAba : '@',
//				idAba : '@'
//			},
//			link : function(scope, element, attrs, tabsCtrl) {
//				tabsCtrl.adicionarTh(scope);
//			},
//			template :
//				'<th ng-transclude></th>',
//			replace : true
//		};
//	})
//	.directive('linha', function() {
//		return {
//			require : '^tabela',
//			restrict : 'E',
//			transclude : true,
//			scope : {
//				labelAba : '@',
//				idAba : '@'
//			},
//			link : function(scope, element, attrs, tabsCtrl) {
//				tabsCtrl.adicionarTr(scope);
//			},
//			template :
//				'<tr ng-transclude></tr>',
//				replace : true
//		};
//	})

//--------------------------------------------------------------------------------------------
// CELULAS = GRIDS
//--------------------------------------------------------------------------------------------
.directive('celula', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			tamanho: '@'
		},
		template: '<div class="grid_{{this.tamanho}}" ng-transclude></div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------
.directive('caixa', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			descricao: '@'
		},
		template: '<div class="ui-widget ui-widget-content ui-corner-all" ng-transclude>' +
			'<div class="ui-widget-header ui-corner-all">{{this.descricao}}</div>' +
			'</div>',
		replace: true
	};
})

//--------------------------------------------------------------------------------------------
// LEGENDA
//--------------------------------------------------------------------------------------------
.directive('legenda', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				descricao: '@'
			},
			template: '<div class="legenda">' +
				'<h3>{{this.descricao}}</h3>' +
				'<ul ng-transclude></ul>' +
				'</div>',
			replace: true
		};
	})
	.directive('itemLegenda', function() {
		return {
			require: '^legenda',
			restrict: 'E',
			transclude: true,
			scope: {
				cor: '@'
			},
			template: '<li class="item-legenda" style="background: {{this.cor}}" ng-transclude></li>',
			replace: true
		};
	})

//--------------------------------------------------------------------------------------------
// SET BOTOES
//--------------------------------------------------------------------------------------------
.directive('setbotoes', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				id: '@'
			},
			controller: function($scope, $element) {
				var itens = $scope.itens = [];

				this.adicionarItem = function(itembotoes) {
					itens.push(itembotoes);
				};
			},
			template: '<div id="{{this.id}}" class="buttonset" ng-transclude>' +
				'<div ng-repeat="itembotoes in itens" style="display: inline;">' +
				'<input type="radio" id="{{itembotoes.id}}" name="{{itembotoes.name}}" />' +
				'<label for="{{itembotoes.id}}" style="height: 26px;">{{itembotoes.descricao}}</label>' +
				'</div>' +
				'</div>',
			replace: true
		};
	})
	.directive('itembotoes', function() {
		return {
			require: '^setbotoes',
			restrict: 'E',
			transclude: true,
			scope: {
				id: '@',
				descricao: '@',
				name: '@'
			},
			link: function(scope, element, attrs, setCtrl) {
				setCtrl.adicionarItem(scope);
			},
			template: '<teste/>',
			replace: true
		};
	})
