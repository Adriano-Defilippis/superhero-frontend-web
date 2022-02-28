/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function FeedbacksService (
    RestService, User, Services, ngDialog, $q
){
    "ngInject";

    const self = this;
    const model = {
        template: 'app/user/feedback-modal/feedback-modal.html',
        attributes: {
          professionalita: 0,
          gentilezza: 0,
          capacitaInterazioneIntrattenimento: 0,
          puntualita: 0,
          descrizione: ''
        }
    }

    self.getModal = getFeedbackModel;

    function getFeedbackModel (feedbackInfo) {
        const modalInfo = {
            template: model.template,
            data: {
                feedback: feedbackInfo
            },
            className: 'ngdialog-theme-default feedback-modal',
            controller: 'FeedbackModalController as FeedbackModal'
        }
        ngDialog.open(modalInfo);
    }
}
