angular.module('rafflesApp.services.dates', [])
  .service('Dates', [function() {
    var to,
      from;
    
    to = new Date();
    to.setHours(12);
    to.setMinutes(0);
    to.setSeconds(0);
    to.setMilliseconds(0);
    
    from = new Date(to - 1000*60*60*24);

    this.getTo = function() {
      return to;
    };
    
    this.getFormattedTo = function() {
      return to.toISOString();
    };
    
    this.setTo = function(dt) {
      to = dt;
    };
    
    this.getFrom = function() {
      return from;
    };
    
    this.getFormattedFrom = function() {
      return from.toISOString();
    };
    
    this.setFrom = function(dt) {
      from = dt;
    };

  }]);