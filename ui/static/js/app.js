'use strict';

var rafflesApp = angular.module('rafflesApp', ['rafflesControllers']);

var rafflesControllers = angular.module('rafflesControllers', []);

rafflesControllers.controller('RaffleListCtrl', ['$scope', '$http', '$log',
  function($scope, $http, $log) {
    $scope.emails = [];

    $scope.todate = new Date();
    $scope.fromdate = new Date($scope.todate.getFullYear(),
      $scope.todate.getMonth()-1, $scope.todate.getDate());
    $scope.localpart = '';

    $scope.updateView = function() {
      $http({
        method: 'GET',
        url: '/api/raffles',
        params: {
          fromdate: $scope.fromdate,
          todate: $scope.todate,
          localpart: $scope.localpart
        }
      }).then(function(response) {
        $scope.emails = response.data;
      });
    };
  }]);
