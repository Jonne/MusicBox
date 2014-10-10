angular.module('musicbox')
  .directive('musicboxSlider', function () {
    return {
      restrict: 'AE',
      replace: true,
      template: '<input type="text" />',
      scope: {
        sliderValue: '=',
        onSliderValueChanging: '&',
        onSliderValueChanged: '&'
      },
      link : function(scope, element, attrs){
        var slider = $(element).slider(scope.$eval(attrs.musicboxSlider));

        slider.on('slideStart', function(ev) {
          scope.onSliderValueChanging({sliderValue: ev.value});
        });

        slider.on('slideStop', function(ev) {
          scope.onSliderValueChanged({sliderValue: ev.value});
        });

        scope.$watch('sliderValue', function(value) {
          if(value) {
            slider.slider('setValue', value, false);
          }
        });
      }
    };
  }); 