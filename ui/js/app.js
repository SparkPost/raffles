'use strict';

var rafflesApp = angular.module('rafflesApp', ['rafflesControllers']);

var rafflesControllers = angular.module('rafflesControllers', []);

rafflesControllers.controller('RaffleListCtrl', ['$scope', '$http', '$log',
  function($scope, $http, $log) {
    $scope.raffles = [];

    $http({
      method: 'GET',
      url: '/raffles',
    }).then(function(response) {
      $scope.raffles = response.data.results;
    }).catch(function(err) {
      console.log('/raffles error: ' + JSON.stringify(err));
    });

    $scope.pickWinner = function(localpart) {
      $http({
        method: 'GET',
        url: '/raffles/' + localpart + '/winner'
      }).then(function(response) {
        if (response.errors) {
        } else {
        }
      });
    };
  }]);
