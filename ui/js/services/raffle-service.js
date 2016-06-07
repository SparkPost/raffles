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
      }).then(function(response) {
        return response.data.results;
      }).catch(errorFormatter);
    };

    Raffle.pickWinner = function(localpart) {
      return $http({
        method: 'GET',
        url: '/raffles/' + localpart + '/winner'
      }).then(function(response) {
        if (response.data.errors) {
          throw new Error(response.errors.join('<br/>'));
        }
        
        return response.data.results.winner_address;
      }).catch(errorFormatter);
    };

    function errorFormatter(err) {
      throw new Error(err.data + ' (' + err.status + ')');
    }
  }]);