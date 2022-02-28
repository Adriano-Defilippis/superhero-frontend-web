'use strict';

export default function StepsDirective () {
  return {
    restrict: 'E',
    scope: {
      steps: '=steps',
      active: '=active',
      onClick: '&'
    },
    template:
    '<div id="steps">'+
    	'<div class="step" ng-repeat="step in steps track by step.order" ng-class="{\'active\': active === step.order, \'done\': step.order < active, \'disabled\': active > 3 }" data-desc="{{step.value}}" ng-click="goToStep(step.order)">'+
    		'<i class="icon-ok" ng-show="step.order < active"></i>'+
    		'<span class="{{step.order < active ? \'glyphicon glyphicon-ok\' : \'\'}}">{{step.order >= active ? step.order : \' \'}}</span>'+
    	'</div>'+
    '</div>',
    controller: ['$scope', '$element', function($scope, $element){
    	var el = $element,
    		self = this;

      $scope.goToStep = function(step){
        $scope.onClick()(step);
      }

    	self.steps = $scope.steps;
    }]
  };
}
