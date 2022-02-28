'use strict';

export default function UserSidebarController (
    $scope,ngDialog, User, AssetsStore, Services, Feedbacks, $ngRedux, BookingActions, $rootScope, $state
) {
    "ngInject";

  	var self = this;

    self.appointmentsOfTheDay = User.appointmentsOfTheDay;
    self.heroesList = User.heroes;
    self.carnetList = User.carnetActive;
    self.carnetAllList = User.carnet;
    self.feedbacksRequests = User.feedbacksRequests;
    self.feedbacks = User.feedbacks;

    self.showAppointmentInfo = function(id){
      User.showAppointmentDetail(id);

    }
    
    self.isBacheca = $state.current.name === "main.user.index" || $state.current.name === "main.user.bnbIndex";

    self.isApp = false;

    if ($rootScope.isApp) {
      self.isApp = $rootScope.isApp;
    }

    self.isBnb = _.includes($state.current.url, 'BNB');

    self.newCarnetOrder = function(carnet){
      //Booking.startNewCarnetOrder(carnet);
      $ngRedux.dispatch(BookingActions.startBookingWithCarnet(carnet));
    }

    self.showFeedbackModal = function(feedback){
      Feedbacks.getModal(feedback);
    }

    self.showDiscount = function ()
    {
        return false;
        //if (self.carnetList.length > 0) return false;
        //else return true;
    }

     /* CUSTOM */
    self.startVoucherPopup = function(){
       ngDialog.closeAll(); // close any open modal
       ngDialog.open({
         template: 'app/booking/voucher-popup.html',
         controller: 'CarnetPopupChoiceCtrl', // <- nome del controller era sbagliato
         data: {
           //heroInfo: heroInfo
         }
       });
      }
    /* END CUSTOM */

}
