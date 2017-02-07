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
  .controller('DashboardCtrl', ['$stateParams', '$sce', 'Raffle', 'Alerts', 'Socket', '$location', function($stateParams, $sce, Raffle, Alerts, Socket, $location) {
    var ctrl = this;
    ctrl.raffle = $stateParams.raffle;

    var strStoredRaffle = localStorage.getItem(ctrl.raffle) || '{"title":"Enter to Win"}';
    ctrl.storedRaffle = JSON.parse(strStoredRaffle);
    ctrl.count = 0;
    ctrl.recentEntries = [];
    ctrl.details = '';
    console.log($location.search().compact);
    ctrl.compact = $location.search().compact || false;
    console.log(ctrl.compact);

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
              subject: entry.subject,
              maskedEmail: entry.from.split('@') + '@email.com'
            };
          });
        });
    };

    ctrl.init_dashboard = function() {
      ctrl.getCount();
      ctrl.getRecentEntries();
      // Test Data
      /*ctrl.count = 5;
      ctrl.recentEntries = [
        { email: 'username@company.com', subject: 'Subject Title for Raffle', maskedEmail: 'username@email.com'},
        { email: 'firstname.lastname@businessdomain.com', subject: 'Subject Title for Raffle', maskedEmail: 'firstname.lastname@email.com'},
        { email: 'flastname@domain.com', subject: 'Really long subject line for Raffle', maskedEmail: 'flastname@email.com'},
        { email: 'firstlastname@longcompanyname.com', subject: 'Subject Title for Raffle', maskedEmail: 'firstlastname@email.com'},
        { email: 'flastna@business.com', subject: 'Really long subject line for Raffle', maskedEmail: 'flastna@email.com'}
      ];*/
    };

    ctrl.onEditSave = function($event) {
      if ($event.keyCode === 13) {
        angular.element($event.target).blur();
      } else if ($event.type === 'blur') {
        localStorage.setItem(ctrl.raffle, JSON.stringify(ctrl.storedRaffle));
      }
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
