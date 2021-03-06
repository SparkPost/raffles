'use strict';

angular.module('rafflesApp.services.raffles', ['rafflesApp.services.dates'])
  .service('Raffle', ['$http', 'Dates', function($http, Dates) {
    var Raffle = this;

    Raffle.getCount = function(raffle) {
      return $http({
        method: 'GET',
        url: '/raffles/' + raffle,
        params: {
          from: Dates.getFormattedFrom(),
          to: Dates.getFormattedTo()
        }
      })
      .then(function(response) {
        if (response.data.errors) {
          throw new Error(response.errors.join('<br/>'));
        }

        return getResults(response).num_entries;
      })
      .catch(errorFormatter);
    };

    Raffle.list = function() {
      return $http({
        method: 'GET',
        url: '/raffles',
        params: {
          from: Dates.getFormattedFrom(),
          to: Dates.getFormattedTo()
        }
      })
      .then(getResults)
      .catch(errorFormatter);
    };

    Raffle.pickWinner = function(raffle) {
      return $http({
        method: 'GET',
        url: '/raffles/' + raffle + '/winner',
        params: {
          from: Dates.getFormattedFrom(),
          to: Dates.getFormattedTo()
        }
      })
      .then(function(response) {
        if (response.data.errors) {
          // This route will only return one error.
          throw new Error(response.data.errors[0].message);
        }

        return getResults(response).from;
      })
      .catch(errorFormatter);
    };

    Raffle.listEntries = function(raffle, options) {
      var params = {
        from: Dates.getFormattedFrom(),
        to: Dates.getFormattedTo()
      };
      options = options || {};

      if (options.sort) {
        params.sort = options.sort;
      }

      if (options.limit) {
        params.limit = options.limit;
      }

      return $http({
        method: 'GET',
        url: '/raffles/' + raffle + '/entries',
        params: params
      })
      .then(getResults)
      .catch(errorFormatter);
    };

    function getResults(response) {
      return response.data.results;
    }

    function errorFormatter(err) {
      throw new Error(err.data + ' (' + err.status + ')');
    }
  }]);
