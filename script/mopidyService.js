angular.module('musicbox')

  .service('mopidy', function() {

    var mopidy = new Mopidy({
        webSocketUrl: "ws://192.168.1.102:6680/mopidy/ws/",
        autoConnect: false
    });

    mopidy.on(console.log.bind(console));

    function wrap(thisObj, functionNameToWrap) {
      var args = Array.prototype.slice.call(arguments, 1);
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
      for(var i = 0; i < namespaces.length; i++) {
        mopidy = mopidy[namespaces[i]];
      }
      return mopidy[func].apply(mopidy, args);
    }

    return {
      isConnected: false,
      connect: function(){
        var self = this;

        mopidy.on("state:online", function() {
          self.isConnected = true;
        });

        mopidy.on("state:offline", function() {
          self.isConnected = false;
        });        
        
        mopidy.connect();
      },    

      getPlaylists: function(){
        return wrap(this, 'playlists.getPlaylists');
      },

      getPlaylist: function(uri){
        return wrap(this, 'mopidy.playlists.lookup')({ uri: uri });
      }      
    };
  });