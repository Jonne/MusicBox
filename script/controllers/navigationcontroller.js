angular.module('musicbox')
  .controller('NavigationController', function($scope, mopidy, $state) {

    $scope.search = function(){
      $state.go('search', {query: $scope.query});  
    }
  
  });