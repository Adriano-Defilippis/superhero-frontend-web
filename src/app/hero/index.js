'use strict';

export default function HeroIndexController (
    $scope, $rootScope, $interval, $timeout, heroInfo, CalendarService, LoginService
) {
    "ngInject";

  	var self = this;

    //CalendarService.injectData(calendarResData.data.plain(), calendarReqData.data.plain(), calendarAvailData.data.plain());

  	self.isLoading = CalendarService.loading;
  	self.showCalAvailability = false;
    self.showNightPeriod = false;
    self.selectedHoursSpan = CalendarService.selectedHoursSpan;

    self.setHoursSpan = function (hours) {
        $timeout(function () {
            CalendarService.selectedHoursSpan = hours;
            self.selectedHoursSpan = CalendarService.selectedHoursSpan;
        });
    }

  	$scope.$watch(function(){ return CalendarService.loading },function(newValue, oldValue) {
	    if ( newValue !== oldValue ) {
	    	// Only increment the counter if the value changed
	    	$timeout(function(){
	    		self.isLoading = newValue;
	    	});
	    }
	  });

  }
