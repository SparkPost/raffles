'use strict';

angular.module('rafflesApp', ['rafflesApp.controllers', 'ui.bootstrap', 'ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/raffles');
  }])
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      // reset the state data
      $rootScope.stateData = {};
      // only apply the state data on successful state change
      if (toState.data) {
        $rootScope.stateData = toState.data;
      }
    });
  });

