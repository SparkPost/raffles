angular.module('rafflesApp.services.alerts', [])
  .service('Alerts', ['$rootScope', function($rootScope) {
    var Alerts = this;

    Alerts.addInfo = function(msg) {
      addAlert('success', msg);
    };

    Alerts.addWarning = function(msg) {
      addAlert('warning', msg);
    };

    Alerts.addError = function(msg) {
      addAlert('danger', msg);
    };

    function addAlert(type, message) {
      $rootScope.$broadcast('alert', {type: type, message: message});
    }
  }]);