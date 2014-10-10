angular.module('musicbox', ['ui.router'])

  .config(function($stateProvider, $urlRouterProvider){
    
    $urlRouterProvider.otherwise('/playlists');
    
    $stateProvider
        .state('playlists', {
            url: '/playlists',
            templateUrl: 'views/playlists.htm',
            controller: 'PlaylistMenuController'
        })
        .state('playlists.details', {
            url: '/:playlistUri',
            templateUrl: 'views/playlist.htm',
            controller: 'PlaylistController'
        })
        .state('search', {
            url: '/search?query',
            templateUrl: 'views/search.htm',
            controller: 'SearchController'
        })                
        .state('queue', {
            url: '/queue',
            templateUrl: 'views/queue.htm',
            controller: 'QueueController'
        });  	
  })

  .run(['mopidy', function(mopidy){
    mopidy.connect();
  }]);