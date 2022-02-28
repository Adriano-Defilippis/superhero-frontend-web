'use strict';

import ModalsFactory from './modals.factory';

import AddAvailController from './add-availability-block.controller';
import EditAvailController from './edit-availability-block.controller';

export default angular.module('ilmiosupereroe.modals', ['ilmiosupereroe.services'])

    .factory('Modals', ModalsFactory)

    .controller('editAvailCtrl', EditAvailController)
    .controller('addAvailCtrl', AddAvailController);
