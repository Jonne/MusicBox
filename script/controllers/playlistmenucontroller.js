angular.module('musicbox')
  .controller('PlaylistMenuController', ['$scope', 'mopidy', '$state', function($scope, mopidy, $state) {

    mopidy.getPlaylists().then(function(playlists){
      var playListNames = _.map(playlists, function(playlist){ return {name: playlist.name, uri: playlist.uri}; });
      $scope.playlists = playListNames; 
      $scope.$apply();

      if(playlists.length > 0){
        $state.go('playlists.details', {playlistUri: playlists[0].uri});  
      }
      
    });  

  }]);