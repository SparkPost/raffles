angular.module('rafflesApp.controllers.entriesList', [
    'ui.router',
    'rafflesApp.services.raffles',
    'rafflesApp.services.alerts',
    'rafflesApp.directives'
  ])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('entries', {
        url: "/raffles/:raffle",
        controller: 'EntriesListCtrl as ctrl',
        templateUrl: "js/views/entries/entries.html"
      });
  }])
  .controller('EntriesListCtrl', ['$stateParams', 'Raffle', 'Alerts', function($stateParams, Raffle, Alerts) {
    var ctrl = this;

    ctrl.raffle = $stateParams.raffle;
    ctrl.entries = [];
    
    ctrl.getEntries = function() {
      Raffle.listEntries(ctrl.raffle)
        .then(function(entries) {
          ctrl.entries = entries;
        })
        .catch(function(err) {
          Alerts.addError(err);
        });
    };

    ctrl.getEntries();

  }]);
