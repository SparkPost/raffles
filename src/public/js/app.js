'use strict';

angular.module('rafflesApp', ['rafflesApp.controllers', 'ui.bootstrap', 'ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/raffles');
  }]);

