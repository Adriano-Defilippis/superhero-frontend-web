'use strict';

export default function RangeSliderDirective (
    $compile, $timeout
) {
    "ngInject";

    return {
      scope: {},
      priority: -1,
      link: function (scope, element) {
        $timeout(function () {
          element.rangeslider({polyfill:false});
        });
      }
    };
  }
