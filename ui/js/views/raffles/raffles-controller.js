angular.module('rafflesApp.controllers.raffleList', [
    'ui.router',
    'rafflesApp.services.raffles',
    'rafflesApp.services.alerts',
    'rafflesApp.directives'
  ])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('raffles', {
        url: "/raffles",
        controller: 'RaffleListCtrl as ctrl',
        templateUrl: "js/views/raffles/raffles.html"
      });
  }])
  .controller('RaffleListCtrl', ['Raffle', 'Alerts', function(Raffle, Alerts) {
    var ctrl = this;

    ctrl.raffles = [];
    
    ctrl.getResults = function() {
      Raffle.list().then(function(raffles) {
        ctrl.raffles = raffles;
      }).catch(function(err) {
        Alerts.addError('While GETting from /raffles: ' + err);
      });
    };

    ctrl.pickWinner = function(localpart) {
      Raffle.pickWinner(localpart).then(function(winner) {
        Alerts.addInfo('Winner of raffle "' + localpart + '": ' + winner);
      }).catch(function(err) {
        Alerts.addError('While GETting winner: ' + err);
      });
    };

    ctrl.getResults();
  }]);
