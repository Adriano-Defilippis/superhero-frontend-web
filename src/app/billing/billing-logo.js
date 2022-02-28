'use strict';

import '../services/assets-store';

export default function BillingLogoDirective(
      AssetsStore
  ) {
      "ngInject";

    return {
      restrict: 'EA',
      template: '<img class="billing-logo" ng-src="{{logoUrl}}">',
      link: linkFunction
    }

    function linkFunction (scope, elem, attrs)
    {
        scope.logoUrl = AssetsStore.Icon('badge.mainLogoBk');
    }


  }
