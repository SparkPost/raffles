'use strict';

// a roll up module to simplify including controllers in the app
angular.module('rafflesApp.controllers', [
  'rafflesApp.controllers.raffleList',
  'rafflesApp.controllers.entriesList',
  'rafflesApp.controllers.dashboard'
]);
