"use strinct";

export default function FeedbackModalController ($scope, $timeout, $state, RestService, User, Feedbacks) {
    "ngInject";

    const self = this;
    const modalState = _.clone($state.current.name);

    self.feedbackInfo = $scope.ngDialogData.feedback;
    self.heroName = self.feedbackInfo.nome;

    self.options = {
        maxValue: 4,

        states: {
            on: 'glyphicon-star feedback-yellow',
            off: 'glyphicon-star grey-text text-lighten-1'
        }
    }

    self.attributes = {}

    self.showHeroProfile = function () {
        User.showHeroProfile(self.feedbackInfo.heroInfo , function() {
            $timeout(() => {
                if( _.clone($state.current.name) === modalState) Feedbacks.getModal(self.feedbackInfo);
            });
        });
    }

    self.showAppointmentInfo = function () {
        User.showAppointmentDetail(self.feedbackInfo.appointment, () => {
            Feedbacks.getModal(self.feedbackInfo);
        });
    }

    self.sendFeedback = function () {
        let ok = true;
        _.forEach(self.attributes, function(a){
            if(_.isNumber(a) && a < 1) ok = false;
            if(_.isString(a) && a == '') ok = false;
        });
        if(ok){
            let feedb = _.merge({}, self.attributes, {
                superHero: { id: self.feedbackInfo.hero },
                appuntamento: { id: self.feedbackInfo.appointment }
            });
            RestService.sendNewFeedback(User.info().id, feedb).then(function(data){
                $timeout(function(){
                    User.setAppointmentRecensito(self.feedbackInfo.appointment);
                });
                $scope.closeThisDialog();
            }, function(){
                self.error = 'Spiacente, c\'è un errore con il server. Riprova più tardi.';
            });
        } else {
            self.error = 'Spiacente, per inviare il tuo feedback devi compilare tutti i dati';
        }
    }

}
