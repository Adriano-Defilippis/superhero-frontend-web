'use strict';

export default function ContactCenterFeedbackController (
    $scope, feedbacks, ContactCenter
) {
    "ngInject";

  	var self = this;

    self.recensioni = [];

    if(feedbacks.data.plain().length > 0){
      var feedb = [];
      feedbacks.data.plain().forEach(function(r){
        // decorazione del model
        r.dataCreazioneLabel = moment(r.dataCreazione).format('DD/MM/YYYY');
        feedb.push(r);
      });

      // pusho i feedback nel model della view
      self.recensioni.length = 0;
      self.recensioni.push.apply(self.recensioni, feedb);
    }

    self.approveFeedback = function(feedback){
      ContactCenter.approveFeedback(feedback);
    }

    self.disapproveFeedback = function(feedback){
      ContactCenter.disapproveFeedback(feedback);
    }

  }
