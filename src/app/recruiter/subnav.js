'use strict';

export default function RecruiterSubBarController (
    $scope
) {
    "ngInject";

    var self = this;

    self.items = [{
        //icon: '/assets/icons/eye.svg',
        iconClass: 'mdi-action-visibility icon-center',
        label: 'Guarda le candidature',
        target: 'main.recruiter.applications'
    },{
        //icon: '/assets/icons/doc-check.svg',
        iconClass: 'mdi-action-note-add icon-center',
        label: 'Registra nuovo profilo',
        target: 'main.recruiter.new'
    },{
        //icon: '/assets/icons/search.svg',
        iconClass: 'mdi-action-search icon-center',
        label: 'Cerca profilo',
        target: 'main.recruiter.profiles',
    },{
        //icon: '/assets/icons/db.svg',
        iconClass: 'mdi-file-folder-shared icon-center',
        label: 'Candidature archiviate',
        target: 'main.recruiter.archive'
    },{
        //icon: '/assets/icons/db.svg',
        iconClass: 'mdi-communication-chat icon-center',
        label: 'Recensioni collaboratori',
        target: 'main.recruiter.feedbacks'
    }];

}
