angular.module('musicbox')

  .service('mopidy', function($rootScope) {

    var mopidy = new Mopidy({
        webSocketUrl: "ws://192.168.1.104:6680/mopidy/ws/",
        autoConnect: false
    });

    mopidy.on(console.log.bind(console));

    function wrap(thisObj, functionNameToWrap) {
      var args = Array.prototype.slice.call(arguments, 2);
      var self = thisObj || this;      

      return new Promise(function(resolve, reject){
        if (self.isConnected) {
          executeFunctionByName(functionNameToWrap, args).then(resolve).otherwise(reject);
        } 
        else
        {
          mopidy.on("state:online", function() {
            executeFunctionByName(functionNameToWrap, args).then(resolve).otherwise(reject);
          });
        }
      });
    }

    function executeFunctionByName(functionName, args) {
      var namespaces = functionName.split(".");
      var func = namespaces.pop();

      var context = mopidy;

      for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
      }
      return context[func].apply(context, args);
    }

    return {
      isConnected: false,
      connect: function(){
        var self = this;  
        
        mopidy.on(function(ev, args) {
          $rootScope.$broadcast('mopidy:' + ev, args);
          if (ev === 'state:online') {
            self.isConnected = true;
          }
          if (ev === 'state:offline') {
            self.isConnected = false;
          }
        });

        mopidy.connect();
      },    

      getPlaylists: function(){
        return wrap(this, 'playlists.getPlaylists', false);
      },
      getPlaylist: function(uri){
        return wrap(this, 'playlists.lookup', uri);
      },
      getCurrentTrack: function(){
        return wrap(this, 'playback.getCurrentTrack');
      },
      getTracklist: function(){ 
        return wrap(this, 'tracklist.getTracks');
      },
      getState: function(){
        return wrap(this, 'playback.getState');
      },
      play: function(){
        return wrap(this, 'playback.play');
      },
      pause: function(){
        return wrap(this, 'playback.pause');
      },      
      stop: function(){
        return wrap(this, 'playback.stop');
      },
      next: function(){
        return wrap(this, 'playback.next');
      },
      previous: function(){
        return wrap(this, 'playback.previous');
      },
      getTimePosition: function(){
        return wrap(this, 'playback.getTimePosition');
      },      
      seek: function(position){
        return wrap(this, 'playback.seek', position);
      },        
      getVolume: function(){
        return wrap(this, 'playback.getVolume');
      },  
      setVolume: function(volume){
        return wrap(this, 'playback.setVolume', volume);
      },              
      clearPlaylist: function(){
        return wrap(this, 'tracklist.clear');
      },
      search: function(query){
        return wrap(this, 'library.search', {'any': [query]});
      },
      play:function(tracks, trackToStartWith){
        var self = this;
        return new Promise(function(resolve, reject){
          self.clearPlaylist().then(function(){
            wrap(self, 'tracklist.add', {tracks: tracks}).then(function(){

              self.getTracklist().then(function(tracklist){
                var track = _find(tracklist, function(track){ track.uri == trackToStartWith.uri; });

                wrap(self, 'playback.play', track).then(resolve);  
              });
            });
          })
        });
      }
    };
  });