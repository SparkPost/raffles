'use strict';

var rafflesControllers = angular.module('rafflesControllers', []);

rafflesControllers.controller('RaffleListCtrl', ['$scope', '$location', 'Raffle',
  function($scope, $location, Raffle) {
    $scope.raffles = Raffle.query();

    $scope.editRaffle = function(raffleID) {
      $location.path('/raffles/' + raffleID);
    };
  }]);

function mergeDateTime(dt, tm) {
  return new Date(
    dt.getFullYear(),
    dt.getMonth(),
    dt.getDate(),
    tm.getHours(),
    tm.getMinutes()
  );
}

rafflesControllers.controller('RaffleCtrl', ['$scope', '$routeParams', '$location', 'Raffle',
  function($scope, $routeParams, $location, Raffle) {
    var now = new Date();
    
    $scope.raffle = Raffle.get({raffleId: $routeParams.raffleId}, function(raffle) {
      $scope.start_date = new Date(raffle.start_time);
      $scope.start_time = new Date(raffle.start_time);
      $scope.end_date  = new Date(raffle.end_time);
      $scope.end_time = new Date(raffle.end_time);

      $scope.status = function() {
        if (raffle.start_time <= now) {
          if (raffle.end_time > now) {
            return "active";
          } 
          return "finished";
        }
        return "scheduled";
      };
    });
    
    $scope.home = function() {
      $location.path('/raffles/');
    };

    $scope.save = function() {
      $scope.raffle.start_time = mergeDateTime($scope.start_date, $scope.start_time);
      $scope.raffle.end_time = mergeDateTime($scope.end_date, $scope.end_time);
      Raffle.update({raffleId: $routeParams.raffleId}, $scope.raffle);
    };
  }]);
