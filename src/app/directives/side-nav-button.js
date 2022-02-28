'use strict';

export default function SideNavButtonDirective (
    $timeout
) {
    "ngInject";

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      $timeout(function(){

        $('.drag-target').remove();

        element.sideNav({
          closeOnClick: true
        });

      });

    }
  }
}
