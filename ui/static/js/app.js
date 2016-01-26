'use strict';

var rafflesApp = angular.module('rafflesApp', [
  'ngRoute',
  'rafflesControllers',
  'rafflesServices'
]);

rafflesApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/raffles', {
      templateUrl: 'partials/list.html',
      controller: 'RaffleListCtrl'
    }).
    when('/raffles/:raffleId', {
      templateUrl: 'partials/raffle.html',
      controller: 'RaffleCtrl'
    }).
    otherwise({ redirectTo: '/raffles' });
}]);
