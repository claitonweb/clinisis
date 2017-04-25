compileFunction = function(templateElement, templateAttrs){
	for(var normalizedAttr in templateAttrs.$attr){
		var attr = templateAttrs.$attr[normalizedAttr];
		templateElement.removeAttr(attr);

		if(attr == 'options' && templateAttrs[attr] == ''){
			templateElement.find('select').removeAttr('ng-options');
		}
		else{
			attr = attr.replace('data-', '');
			if(attr.indexOf('ng') === 0){
				attr = attr.replace('ng', 'ng-');
			}
			
			if(attr.indexOf('tam') >=0){
				templateElement.html(templateElement.html().replace('col-md-6','col-md-'+templateAttrs.tam));
				templateElement.html(templateElement.html().replace('col-xs-6','col-xs-'+templateAttrs.tam));
			}

			
			
			templateElement.html( templateElement.html().split('{{'+attr+'}}').join(templateAttrs[normalizedAttr]) );


			if(attr.indexOf('required') >=0){
				templateElement.html(templateElement.html().replace(templateAttrs['label'],templateAttrs['label'] + " <span class='text-danger'>*</span> "));
				templateElement.html(templateElement.html().replace('{{label}}',templateAttrs['label'] + " <span class='text-danger'>*</span> "));
			}

			templateElement.find('input, select').attr(attr, templateAttrs[normalizedAttr]);
		}
	}

	return {
		pre: function(scope, element, attrs) {},
		post: function(scope, element, attrs) {}
	}
};

angular.module('formDirectives', [])
.directive('inputText', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6 col-xs-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<input type="text" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control"/>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputEmail', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<input type="text" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control"/>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputTelefone', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<input type="text" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control"'+
							' model-view-value="true" ui-mask="(99) 99999999?9" ui-mask-placeholder="" ui-mask-placeholder-char="space" />' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputNumber', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<input type="number" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control"/>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputMoney', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<input type="text" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control" ui-money-mask/>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputPassword', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<input type="password" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control"/>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputSelect', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8">' +
						'<select id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" class="form-control"' +
							' ng-options="option._id as option.nome for option in {{options}}" ng-transclude/>'+
						'</select>'+
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputMultiselect', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<select type="number" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" multiple {{attrs}} class="form-control"' +
							' ng-options="option._id as option.nome for option in {{options}}" />'+
						'</select>'+
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})


.directive('inputHidden', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
					'<input type="hidden" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} />' +
				'</div>'
	};
})

.directive('inputCheck', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<label for="{{field}}">' + //switch switch-primary
							'<input type="checkbox" id="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} value="1">' +
							'<span data-toggle="tooltip" title="{{tooltip}}"></span>' +
						'</label>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'/*template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<label class="switch switch-primary " for="{{field}}">' + //switch switch-primary
							'<input type="checkbox" id="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} value="1">' +
							'<span data-toggle="tooltip" title="{{tooltip}}"></span>' +
						'</label>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'*/
		/*template :  '<div class="template">' +
						'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
							'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
							'<div class="col-md-8" ng-transclude>' +
								'<toggle-switch'+
			              		'ng-model="modelObj.{{field}}"'+
					            'on-label="Sim"'+
				                'off-label="Não">'+
			            		'</toggle-switch>'+
			            	'</div>'+
			            	'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
								'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
							'</div>' +
		            	'</div>'+
            		'</div>'*/
	};
})

.directive('inputColor', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<input type="text" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control"' +
							' ng-style="{background: modelObj.{{field}}}" colorpicker colorpicker-position="top"/>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputCnpj', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<p class="input-group">' +
							'<input type="text" id="{{field}}" name="{{field}}" ng-cnpj  ui-mask="99.999.999/9999-99" ui-mask-placeholder="" ui-mask-placeholder-char="space" ng-model="modelObj.{{field}}" {{attrs}} class="form-control" />' +
							'<span class="input-group-btn">' +
								'<button type="button" class="btn btn-default" ng-click="buscaCnpjReceita()"><i class="glyphicon glyphicon-search"></i></button>' +
							'</span>' +
						'</p>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputCpf', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<p class="input-group">' +
							'<input type="text" id="{{field}}" name="{{field}}" ng-cpf ui-mask="999.999.999-99" ui-mask-placeholder="" ui-mask-placeholder-char="space" ng-model="modelObj.{{field}}" {{attrs}} class="form-control" />' +
							'<span class="input-group-btn">' +
								'<button type="button" class="btn btn-default" ng-click="buscaCpfReceita()"><i class="glyphicon glyphicon-search"></i></button>' +
							'</span>' +
						'</p>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputCep', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<p class="input-group">' +
							'<input type="text" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control" />' +
							'<span class="input-group-btn">' +
								'<button type="button" class="btn btn-default" ng-click="buscaCepCorreios()"><i class="glyphicon glyphicon-search"></i></button>' +
							'</span>' +
						'</p>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputTextarea', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<textarea id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control" rows="5"></textarea>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('inputDate', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div class="col-md-6" ng-class="{ \'has-error\': formObj.{{field}}.$touched && formObj.{{field}}.$invalid }">' +
					'<label class="col-md-4 control-label" for="{{field}}">{{label}}</label>' +
					'<div class="col-md-8" ng-transclude>' +
						'<p class="input-group">' +
							'<input type="text" id="{{field}}" name="{{field}}" ng-model="modelObj.{{field}}" {{attrs}} class="form-control" uib-datepicker-popup="dd/MM/yyyy"' +
							' ng-init="{{field}}.opened = false" is-open="{{field}}.opened" datepicker-options="dateOptions" show-button-bar = "false"' +
							' alt-input-formats="altInputFormats" ui-mask="99/99/9999" ui-mask-placeholder="" ui-mask-placeholder-char="space" model-view-value="true" />' +
							'<span class="input-group-btn">' +
								'<button type="button" class="btn btn-default" ng-click="{{field}}.opened = true"><i class="glyphicon glyphicon-calendar"></i></button>' +
							'</span>' +
						'</p>' +
					'</div>' +
					'<div class="help-block" ng-messages="formObj.{{field}}.$error" ng-show="formObj.{{field}}.$touched">' +
						'<div ng-messages-include="core/common/views/form-messages.html"></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('grupo', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
					'<h4 style="padding: 10px 0; border-bottom: 1px solid #F0F0F0;">{{label}}</h4>' +
					'<div class="panel panel-body" ng-transclude>' +
					'</div>' +
			'</div>'
	};
})

//cep model-view-value="true" ui-mask="99999-999" ui-mask-placeholder="" ui-mask-placeholder-char="space"
.directive('grupoEndereco', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
					'<h4 style="padding: 10px 0; border-bottom: 1px solid #F0F0F0;">{{label}}</h4>' +
					'<div class="panel panel-body">' +
						//'<button type="button" ngclick="copiarParaCobranca()" class="btn btn-effect-ripple btn-primary">Copiar para endereço de cobrança</button>' +
						'<div class="form-group"><div class="row">' +
							'<input-cep field="cep" label="CEP"></input-cep>' +
							'<input-radio field="correspondencia" Correspondência? value="t" ngclick="selecionaEnderecoCorrespondencia(0)"></input-radio>' +
						'</div></div>' +
						'<div class="form-group"><div class="row">' +
							'<input-select field="estado" label="Estado" options="" ngoptions="e._id as e.sigla for e in estados" ngreadonly="false"></input-select>' +
							'<input-select field="cidade" label="Cidade" options="" ngoptions="cidade for cidade in cidades track by cidade">' +
								'<option value=""></option>' +
							'</input-select>' +
						'</div></div>' +
						'<div class="form-group"><div class="row">' +
							'<input-text field="bairro" label="Bairro"></input-text>' +
							'<input-text field="logradouro" label="Logradouro"></input-text>' +
						'</div></div>' +
						'<div class="form-group"><div class="row">' +
							'<input-text field="numero" label="Número"></input-text>' +
							'<input-text field="complemento" label="Complemento"></input-text>' +
						'</div></div>' +
					'</div>' +
			'</div>'
	};
})

.directive('lista', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div ng-controller="{{ctrl}}">' +
					'<div ng-include="\'core/common/views/lista.html\'"></div>' +
				'</div>' +
			'</div>'
	};
})

.directive('cadastro', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
				'<div>' +
					'<div ng-include="\'core/common/views/cadastro-header.html\'"></div>' +
					'<div class="row">' +
						'<div class="col-lg-12" ng-transclude></div>' +
					'</div>' +
				'</div>' +
			'</div>'
	};
})

.directive('formulario', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		compile: compileFunction,
		template: '<div class="template">' +
					'<form id="form-validation" novalidate name="formObj" method="post">' +
						'<div class="block">' +
							'<div class="form-horizontal">' +
								'<div ng-transclude></div>' +
								'<div ng-include="\'core/common/views/cadastro-actions.html\'"></div>' +
							'</div>' +
						'</div>' +
					'</form>' +
				'</div>'
	};
})

.directive('tabs', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: false,
		controller: ["$scope", function($scope) {
			var panes = $scope.panes = [];

			$scope.select = function(pane) {
				angular.forEach(panes, function(pane) {
					pane.selected = false;
				});
				pane.selected = true;
			}

			this.addPane = function(pane) {
				if (panes.length == 0) $scope.select(pane);
				panes.push(pane);
			}
		}],
		template: '<div class="tabbable">' +
			'<ul class="nav nav-tabs">' +
				'<li ng-repeat="pane in panes" ng-class="{active:pane.selected}" ng-hide="pane.tabshow==false">' +
					'<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
				'</li>' +
			'</ul>' +
			'<div class="tab-content" ng-transclude></div>' +
			'</div>'
	};
})

.directive('pane', function() {
	return {
		require: '^tabs',
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			title: '@',
			tabshow: '='
		},
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.addPane(scope);
		},
		template: '<div class="tab-pane" ng-hide="tabshow==false" ng-class="{active: selected}" ng-transclude>' +
			'</div>'
	};
})

.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
})

;
