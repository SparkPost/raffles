'use strict';

angular.module('rafflesApp', ['rafflesControllers', 'ui.bootstrap', 'ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/raffles");
  }]);

