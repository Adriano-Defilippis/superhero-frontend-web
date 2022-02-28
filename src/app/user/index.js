'use strict';

export default function UserIndexController (
    $scope, $rootScope, $interval, $timeout, User, UserCalendarService, AssetsStore, Services
) {
    "ngInject";

  	var self = this;

    self.isApp = $rootScope.isApp;

    var now = new Date();
    now = now.getTime();

    // Feedbacks
    self.feedbacksRequests = User.feedbacksRequests;
    self.nextAppointments = User.appointmentsInFuture;
    self.showAllAppointments = false;


    // View/model
    self.vm = {
      imgPlaceholder: AssetsStore.Image('user.placeholder')
    }

    self.showAppointmentInfo = function(id){
      User.showAppointmentDetail(id);
    }

}
