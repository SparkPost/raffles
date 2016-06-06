'use strict';

angular.module('rafflesApp', ['rafflesControllers', 'ui.bootstrap']);

angular.module('rafflesControllers', [])
  .controller('RaffleListCtrl', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $scope.raffles = [];
    $scope.to_date = new Date();
    $scope.to_date.setHours(12);
    $scope.to_date.setMinutes(0);
    $scope.to_date.setSeconds(0);
    $scope.to_date.setMilliseconds(0);
    $scope.from_date = new Date($scope.to_date - 1000*60*60*24);

    $scope.alerts = [];
    $scope.closeAlert = function(idx) {
      $scope.alerts.splice(idx, 1);
    };

    function showInfo(msg) {
      $scope.alerts.push({type: 'success', msg: msg});
    }
    function showWarning(msg) {
      $scope.alerts.push({type: 'warning', msg: msg});
    }
    function showError(msg) {
      $scope.alerts.push({type: 'danger', msg: msg});
    }
    
    $scope.getResults = function() {
      $http({
        method: 'GET',
        url: '/raffles',
        params: {
          from: $scope.from_date.toISOString(),
          to: $scope.to_date.toISOString()
        }
      }).then(function(response) {
        $scope.raffles = response.data.results;
      }).catch(function(err) {
        showError('While GETting from /raffles: ' + err.statusText);
      });
    };

    $scope.pickWinner = function(localpart) {
      $http({
        method: 'GET',
        url: '/raffles/' + localpart + '/winner'
      }).then(function(response) {
        if (response.data.errors) {
          showWarning(response.errors.join('<br/>'));
        } else {
          showInfo('Winner of raffle "' + localpart + '": ' + response.data.results.winner_address);
        }
      }).catch(function(err) {
        showError('While GETting from /raffles: ' + err.statusText);
      });
    };

    $scope.getResults();
  }]);
