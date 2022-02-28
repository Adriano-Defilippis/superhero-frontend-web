'use strict';

export default function BillingHeaderDirective(

  ) {

    return {
      restrict: 'EA',
      template: '<p class="right-align no-margin all" ng-bind-html="headerContent"></p>',
      link: linkFunction
    }

    function linkFunction (scope, elem, attrs)
    {
        scope.headerContent = 'Digital Heroes Srl<br>Largo Gallarati Scotti 1, 20123, Milano<br>Telefono: 02/86882279';
    }


  }
