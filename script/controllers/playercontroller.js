angular.module('musicbox')
  .controller('PlayerController', function($scope, mopidy) {
    
    function timeFromMilliSeconds(length) {
      if (length === undefined) {
        return '';
      }
      var d = Number(length/1000);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);
      return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
    }

    $scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
      $scope.track = data.tl_track.track;
      $scope.length = timeFromMilliSeconds($scope.track.length);
      $scope.$apply()
    });

    $scope.$on('mopidy:event:playbackStateChanged', function(event, data) {
      $scope.isPlaying = data.new_state === 'playing';
      $scope.$apply();
    });  

    $scope.$on('mopidy:event:volumeChanged', function(event, data) {
      $scope.volume = data.volume;
      $scope.$apply();
    });          

    mopidy.getCurrentTrack().then(function(track){
      $scope.track = track;
      $scope.length = timeFromMilliSeconds($scope.track.length);
    });

    mopidy.getState().then(function(state){
      $scope.isPlaying = state == 'playing';
    });

    mopidy.getVolume().then(function(volume){
      $scope.volume = volume;
    });

    setInterval(function(){
        mopidy.getTimePosition().then(function(timePosition){ 
          if(!isSeeking){
            $scope.currentTimePosition = (timePosition / $scope.track.length) * 100;
            $scope.currentTime = timeFromMilliSeconds(timePosition);
            $scope.$apply();
          }
        })
    }, 1000);

    var isSeeking = false;

    $scope.onTimeChanging = function(sliderValue){
      isSeeking = true;
    }

    $scope.onTimeChanged = function(sliderValue){
        var milliSeconds = ($scope.track.length / 100) * sliderValue;

        mopidy.seek(milliSeconds);
        isSeeking = false;
    }    

    $scope.onVolumeChanged = function(sliderValue){
      mopidy.setVolume(sliderValue);
    }

    $scope.play = function(){
      if($scope.isPlaying){
        mopidy.pause();
      }else{
        mopidy.play();
      }
    }

    $scope.next = function(){
      mopidy.next();
    }

    $scope.previous = function(){
      mopidy.previous();
    }    

    $scope.formatArtists = function(artists){
      var artistNames = _.map(artists, function(artist){
        return artist.name;
      });

      return artistNames.join();
    }    

  });