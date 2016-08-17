'use strict';
/*globals $:false */

angular.module('rafflesApp.controllers.dashboard', [
  'ui.router',
  'rafflesApp.services.raffles',
  'rafflesApp.services.alerts',
  'rafflesApp.services.socket',
  'rafflesApp.directives'
])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/raffles/:raffle/dashboard',
        controller: 'DashboardCtrl as ctrl',
        templateUrl: 'js/views/dashboard/dashboard.html',
        data: {
          bodyClass: 'dashboard'
        }
      });
  }])
  .controller('DashboardCtrl', ['$stateParams', '$sce', 'Raffle', 'Alerts', 'Socket', function($stateParams, $sce, Raffle, Alerts, Socket) {
    var ctrl = this;

    ctrl.editing = false;
    ctrl.raffle = $stateParams.raffle;

    var strStoredRaffle = localStorage.getItem(ctrl.raffle) || '{"title":"Enter to Win"}';
    ctrl.storedRaffle = JSON.parse(strStoredRaffle);
    ctrl.count = 0;
    ctrl.recentEntries = [
      /*{ email: 'username@company.com', subject: 'Subject Title for Raffle'},
      { email: 'firstname.lastname@businessdomain.com', subject: 'Subject Title for Raffle'},
      { email: 'flastname@domain.com', subject: 'Really long subject line for Raffle'},
      { email: 'firstlastname@longcompanyname.com', subject: 'Subject Title for Raffle'},
      { email: 'flastna@business.com', subject: 'Really long subject line for Raffle'}*/
    ];
    ctrl.details = '';

    ctrl.getCount = function() {
      Raffle.getCount(ctrl.raffle)
        .then(function(count) {
          ctrl.count = count;
        })
        .catch(function(err) {
          Alerts.addError(err);
        });
    };

    ctrl.getRecentEntries = function() {
      Raffle.listEntries(ctrl.raffle, { sort: 'created DESC', limit: 5 })
        .then(function(entries) {
          ctrl.recentEntries = entries.map(function(entry) {
            return {
              email: entry.from,
              subject: entry.subject
            };
          });
        });
    };

    ctrl.init_dashboard = function() {
      ctrl.getCount();
      ctrl.getRecentEntries();
    };

    ctrl.onEditClick = function() {
      ctrl.editing = true;
      setTimeout(function() { $('#txtTitle').focus();}, 0);
    };

    ctrl.onEditSave = function() {
      ctrl.editing = false;
      localStorage.setItem(ctrl.raffle, JSON.stringify(ctrl.storedRaffle));
    };

    Socket.on('connect', function() {
      Socket.emit('raffle', ctrl.raffle);
    });

    Socket.on('entry', function(entry) {
      ctrl.count++;
      ctrl.recentEntries.unshift(entry);
      if(ctrl.recentEntries.length > 5) {
        ctrl.recentEntries = ctrl.recentEntries.slice(0, 5);
      }
    });

    ctrl.init_dashboard();

  }]);
