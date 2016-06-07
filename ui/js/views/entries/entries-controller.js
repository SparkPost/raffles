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
  .controller('EntriesListCtrl', ['Raffle', 'Alerts', function(Raffle, Alerts) {
    var ctrl = this;


  }]);
