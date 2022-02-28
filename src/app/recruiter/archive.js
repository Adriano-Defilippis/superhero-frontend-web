'use strict';

export default function RecruiterArchiveController (
    $scope, heroes, RecruiterService
) {
    "ngInject";

    var self = this;

    self.applications = _.map(heroes.data, _sh => {
        if(_sh.competenze) {
  			_sh.competenze = _sh.competenze.replace(/\,/g, ', ');
        }
        return _sh;
    });

}
