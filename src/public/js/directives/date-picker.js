'use strict';

angular.module('rafflesApp.directives.date-picker', ['rafflesApp.services.dates'])
  .controller('datePickerController', ['Dates', function(Dates) {
    var ctrl = this;

    ctrl.from = Dates.getFrom();
    ctrl.to = Dates.getTo();

    ctrl.onChange = function() {
      Dates.setFrom(ctrl.from);
      Dates.setTo(ctrl.to);
      ctrl.onDateChange();
    };
  }])
  .directive('datePicker', function() {
    return {
      restrict: 'E',
      templateUrl: 'js/directives/date-picker.html',
      controller: 'datePickerController as ctrl',
      bindToController: true,
      scope: {
        onDateChange: '&'
      }
    };
  });
