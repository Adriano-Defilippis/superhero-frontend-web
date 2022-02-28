'use strict';

export default function FixedSidebarDirective (
    $compile, $timeout, $window
) {
    "ngInject";

    return {
        restrict: 'A',
        link: linkFunction
    }

    function linkFunction (scope, element) {
        $timeout(() => {
            calculateFixed(scope, element);
        });

        scope.getWindowDimensions = function () {
            return {
                'h': angular.element($window).height(),
                'w': angular.element($window).width()
            };
        };

        scope.getSidebarHeight = function () {
            return element.outerHeight();
        }

        scope.getFixedElementHeight = function () {
            let fixedElement = angular.element(element).find('.sidebar__fixed-bottom');
            return fixedElement.outerHeight();
        }

        scope.$watch(scope.getWindowDimensions, (newV, oldV) => {
            if (newV.h !== oldV.h) calculateFixed(scope, element);
        }, true);

        scope.$watch(scope.getSidebarHeight, (newV, oldV) => {
            if (newV !== oldV) calculateFixed(scope, element);
        }, true);

        scope.$watch(scope.getFixedElementHeight, (newV, oldV) => {
            if (newV !== oldV) calculateFixed(scope, element);
        }, true);

    }

    function calculateFixed (scope, element) {
        let availSpace = calculateAvailableHeightSpace(element);
        setFixedEement(element, availSpace < 1);
    }

    function calculateAvailableHeightSpace (element) {
        let spaceAboveElement = element.position().top;
        let elementHeight = element.outerHeight();
        let windowHeight = angular.element($window).outerHeight();
        let remainingSpace = windowHeight - (elementHeight + spaceAboveElement);
        return remainingSpace;
    }

    function setFixedEement (element, isFixed) {
        let spaceAboveElement = element.position().top;
        let elementHeight = element.outerHeight();
        let windowHeight = angular.element($window).outerHeight();
        let fixedElement = angular.element(element).find('.sidebar__fixed-bottom');
        let stylesToApplyToElement = null,
            stylesToApplyToSidebar = null,
            fixedStyles = {
                position: 'fixed',
                width: element.width(),
                bottom: 0,
                backgroundColor: '#FAFAFA',
                boxShadow: 'rgba(0, 0, 0, 0.456863) 0px -14px 19px -16px',
                'z-index': 10
            },
            staticStyles = {
                position: 'static',
                width: 'auto',
                bottom: 'auto',
                boxShadow: 'none'
            };

        let fixedElementHeight = fixedElement.outerHeight();

        let sidebarWithFixedStyles = {
            paddingBottom: 15 + fixedElementHeight,
        }

        let sidebarWithoutFixedStyles = {
            paddingBottom: 15
        }

        if (isFixed === true) {
            stylesToApplyToElement = fixedStyles;
            stylesToApplyToSidebar = sidebarWithFixedStyles;
        } else {
            stylesToApplyToElement = staticStyles;
            stylesToApplyToSidebar = sidebarWithoutFixedStyles;
        }

        angular.element(fixedElement).css(stylesToApplyToElement);
        element.css(stylesToApplyToSidebar);
    }

    /**
    return {
      restrict: 'A',
      link: function (scope, element) {

        var w = angular.element($window);

        scope.getWinWidth = function(){
          return w.outerWidth();
        }

        scope.getSidebarHeight = function(){
          var paddT = element.css('margin-top') + ' ' + element.css('margin-right') + ' ' + element.css('margin-bottom') + ' ' + element.css('margin-left');
          return element.height();
        }

        scope.forceStatic = false;
        scope.sidebarHeight = 0;
        scope.winHeight = 0;

        scope.$watch(scope.getWinWidth, function(newValue, oldValue) {
          if(newValue != oldValue){
            setSidebarFixed();
          }
        });

        scope.$watch(scope.getSidebarHeight, function(newValue, oldValue) {
          if(newValue != oldValue && (newValue > oldValue+30 || newValue < oldValue-30 )) {
            $timeout(function(){
              scope.sidebarHeight = newValue;
              toggleFixed(newValue);
            });
          }
        });

        $timeout(function(){
          scope.offsetTop = element.position().top;
          setSidebarFixed();
        });

        w.bind('resize', function () {
          scope.$apply();
        });

        function toggleFixed(height){
          scope.winHeight = w.outerHeight();

          //if(offsetTop < 0)
          //  offsetTop = 0;

          if((scope.winHeight - scope.offsetTop) < height)
            scope.forceStatic = true;
          else
            scope.forceStatic = false;

          setSidebarFixed();
        }

        function setSidebarFixed(){
          var width = element.parent().width();
          var winWidth = scope.getWinWidth();
          var breakpoint = 992;

          if(winWidth <= breakpoint || scope.forceStatic){
            element.css({ width: 'auto', position: "static" });
          } else {
            element.css({ width: width, position: "fixed" });
          }
        }
      }
    };
    */
}
