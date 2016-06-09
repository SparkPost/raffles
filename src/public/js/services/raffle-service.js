angular.module('rafflesApp.services.raffles', ['rafflesApp.services.dates'])
  .service('Raffle', ['$http', 'Dates', function($http, Dates) {
    var Raffle = this;

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
        url: '/raffles/' + raffle + '/winner'
      })
      .then(function(response) {
        if (response.data.errors) {
          throw new Error(response.errors.join('<br/>'));
        }

        return getResults(response).winner_address;
      })
      .catch(errorFormatter);
    };

    Raffle.listEntries = function(raffle) {
      return $http({
        method: 'GET',
        url: '/raffles/' + raffle + '/entries',
        params: {
          from: Dates.getFormattedFrom(),
          to: Dates.getFormattedTo()
        }
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
