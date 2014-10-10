angular.module('musicbox')
  .controller('PlaylistController', function($scope, $stateParams, mopidy) {
    
    var uri = $stateParams.playlistUri;

    mopidy.getPlaylist(uri).then(function(playlist){
      $scope.playlist = playlist; 
      $scope.$apply();
    });  

    $scope.play = function(track){
      mopidy.play($scope.playlist.tracks, track);
    }

    $scope.formatArtists = function(artists){
      var artistNames = _.map(artists, function(artist){
        return artist.name;
      });

      return artistNames.join();
    }

  });