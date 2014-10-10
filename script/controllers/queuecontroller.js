angular.module('musicbox')
  .controller('QueueController', ['$scope', 'mopidy', function($scope, mopidy) {
    
    mopidy.getTracklist().then(function(tracklist){
     
      $scope.tracks = tracklist; 
      $scope.$apply();
    });  

    $scope.formatArtists = function(artists){
      var artistNames = _.map(artists, function(artist){
        return artist.name;
      });

      return artistNames.join();
    }    

  }]);