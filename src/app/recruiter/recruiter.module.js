'use strict';

import RecruiterUtilitiesFactory from './recruiter-utilities.factory';

import RecruiterApplicationsController from './applications';
import RecruiterArchiveController from './archive';
import RecruiterBaseController from './base';
import RecruiterEditHeroController from './edit';
import RecruiterNewProfilesController from './new';
import RecruiterHeroesController from './profiles';
import RecruiterSubBarController from './subnav';

export default angular.module('ilmiosupereroe.recruiter', ['ilmiosupereroe.services'])
    .factory('RecruiterUtilities', RecruiterUtilitiesFactory)

    .controller('RecruiterApplicationsCtrl', RecruiterApplicationsController)
    .controller('RecruiterArchiveCtrl', RecruiterArchiveController)
    .controller('RecruiterBaseCtrl', RecruiterBaseController)
    .controller('RecruiterEditHeroCtrl', RecruiterEditHeroController)
    .controller('RecruiterNewProfilesCtrl', RecruiterNewProfilesController)
    .controller('RecruiterHeroesCtrl', RecruiterHeroesController)
    .controller('RecruiterSubBarCtrl', RecruiterSubBarController);
