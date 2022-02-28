'use strict';

export default function ReferralPageController (
    $log, $timeout, User, SERVICES
) {
    "ngInject";
    const self = this;

    self.tagsRegex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;

    this.selectedService = [];
    this.selectedSubService = [];
    this.error = '';
    this.confirm = '';
    this.disabledServices = _.without(_.toArray(SERVICES), SERVICES.COLF, SERVICES.BABYSITTER, SERVICES.BADANTE);

    this.selectService = serviceId => {
        this.selectedService = serviceId;
        this.selectedSubService = '';
    }

    this.selectSubService = (parent, serviceId) => {
        this.selectedService = parent;
        this.selectedSubService = serviceId;
    }

    this.sendInvites = () => {
        self.error = '';
        self.confirm = '';
        // reset messages
        let sendTo = this.invites.map(invite => invite.text);
        let serviceToInvite = this.selectedService;
        if (this.selectedSubService !== '') serviceToInvite = this.selectedSubService;
        // check if data is ok
        let anyError = checkDataBeforeSend(sendTo, serviceToInvite);
        if (anyError !== '') {
            self.error = anyError;
        } else {
            User.sendUserReferrals(serviceToInvite, sendTo).then(response => {
                let plural = sendTo.length > 1 ? 'ai seguenti indirizzi' : 'al seguente indirizzo';
                self.confirm = 'Grazie! Il tuo invito è stato inviato correttamente '+plural+': ' + sendTo.join(', ') + '.';
                self.invites.length = 0;
                resetMessage();
            }, error => {
                let plural = sendTo.length > 1 ? 'uno degli indirizzi inseriti' : 'l\'indirizzo inserito';
                if (error.data.tipo === 'Univocita') self.error = 'Attenzione, '+plural+' è già registrato';
                resetMessage();
            });
        }

    }

    function checkDataBeforeSend (invites = [], service = '') {
        let error = '';
        if (invites.length < 1) error = 'Devi inserire almeno un indirizzo email valido.';
        if (service === '') error = 'Devi selezionare un servizio.';
        return error;
    }

    function resetMessage () {
        $timeout(() => {
            self.error = '';
            self.confirm = '';
        }, 4000);
    }

}
