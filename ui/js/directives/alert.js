angular.module('rafflesApp.directives.alert', [])
  .controller('alertController', ['$rootScope', function($rootScope) {
    var ctrl = this;

    ctrl.alerts = [];

    ctrl.closeAlert = function(index) {
      ctrl.alerts.splice(index, 1);
    };

    $rootScope.$on('alert', function(e, message) {
      ctrl.alerts.push(message);
    });
  }])
  .directive('alert', function() {
    return {
      restrict: 'E',
      templateUrl: 'js/directives/alert.html',
      controller: 'alertController as ctrl',
      bindToController: true,
      scope: {}
    }
  });
