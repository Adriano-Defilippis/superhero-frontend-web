'use strict';

export default function EditAvailController (
    $scope,
    $timeout,
    $log,
    CalendarService
) {
    "ngInject";

    // ctrl
    var ctrl = this;
    var originalId = $scope.ngDialogData.originalId;

    // bindings
    ctrl.editAvail = editAvail;
    ctrl.deleteAvail = deleteAvail;

    // helpers
    function editAvail ()
    {
        $scope.closeThisDialog();
        var availData = CalendarService.getAvailData(originalId);
        CalendarService.triggerMobileAvailabilityModal(originalId, availData.start, availData.end);
    }

    function deleteAvail ()
    {
        $scope.closeThisDialog();
        CalendarService.availabilityDeleted(originalId);
    }

}
