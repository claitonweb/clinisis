var requirements = ['formDirectives', 'ngRoute', 'ui.router', 'ngResource', 'ui.mask', 'ui.bootstrap', 'ngCpfCnpj', 'ngMessages',
	'ui.utils.masks', 'colorpicker.module', 'ngAnimate', 'ngDialog', 'ng-acl', 'infinite-scroll','ui-notification'];

var app = angular.module('clinisis', requirements).config(function($urlRouterProvider, $stateProvider) { //$httpProvider

	$stateProvider.state('404', {
		url: '/404',
		templateUrl: 'core/common/views/404.html' //,
			//controller: 'MainCtrl'
	});


	$urlRouterProvider.otherwise('/');
});
