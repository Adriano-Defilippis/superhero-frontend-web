'use strict';

export default function AutoFillHeightDirective (
    $state, $window, $document, $timeout
) {
    "ngInject";

  return {
    restrict: 'A',
    scope: {
      withFooter: '@autoFillHeight'
    },
    link: function(scope, element, attrs){
    	var el = element,
          w = angular.element($window),
          d = angular.element(),
    		  self = this,
          breakpoint = 600;

      if(scope.withFooter === undefined || scope.withFooter === null)
        scope.withFooter = false;

      if(scope.withFooter === 'true' || scope.withFooter === true)
          scope.withFooter = true;

      scope.getHeight = function() {
        return w.height();
      };

      scope.$watch(scope.getHeight, function(newValue, oldValue) {
        $timeout(function(){
          calculateMinHeight(el[0]);
        });
      });

      w.bind('resize', function () {
        scope.$apply();
      });


      function calculateMinHeight(el){
        $(el).css('min-height', 0);
        var footerHeight = scope.withFooter ? $('footer').outerHeight(true) : 0;//angular.element(document.querySelectorAll(".footer")[0]).context.offsetHeight;

        var maxHeight = w.outerHeight() - footerHeight;

        var height = w.outerHeight() - (footerHeight + $(el).offset().top);
        if(height > maxHeight)
            height = maxHeight;

        var sidebarHeight = $('[sidebar]').outerHeight();
        if(sidebarHeight > height) height = sidebarHeight;

        if(el !== null) {
          if(w.outerWidth() < breakpoint){
            $(el).css('min-height', 0);
          } else {
            $(el).css('min-height', height);
          }
        }
      }
    }
  };
}
