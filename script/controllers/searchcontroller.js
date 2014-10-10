angular.module('musicbox')
  .controller('SearchController', function($scope, $stateParams, mopidy) {
    
	  var query = $stateParams.query;

	  mopidy.search(query).then(function(results){
	   
	  	var spotifyResults = _.find(results, function(result){ 
	  		return result.uri && result.uri.indexOf('spotify') >= 0;
	  	});

	    $scope.results = spotifyResults; 
	    $scope.$apply();
	  });          

    $scope.formatArtists = function(artists){
      var artistNames = _.map(artists, function(artist){
        return artist.name;
      });

      return artistNames.join();
    }          
  });