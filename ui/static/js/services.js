'use strict';

var rafflesServices = angular.module('rafflesServices', ['ngResource']);

rafflesServices.factory('Raffle', ['$resource', 
  function($resource) {
    return $resource('/api/raffles/:raffleId', null, { 
     'update': { method: 'PUT', url: '/api/raffles/:raffleId' } 
    });
  }]);
