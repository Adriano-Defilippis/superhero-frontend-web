'use strict';

export default function AddAvailController (
    $scope,
    $timeout,
    $log
) {
    "ngInject";

    // set starting time for timepickers
    var now = moment();
    var then = moment();

    // reset seconds/milliseconds
    now.seconds(0);
    now.milliseconds(0);
    then.seconds(0);
    then.milliseconds(0);

    var nowHours = now.hours();
    var nowMinutes = now.minutes();
    if (nowMinutes < 30) {
        now.minutes(30)
        then.add(1, 'hours');
        then.minutes(0)
    } else {
        now.add(1, 'hours');
        now.minutes(0)
        then.add(1, 'hours');
        then.minutes(30)
    }

    // ctrl
    var ctrl = this;
    var starting = $scope.ngDialogData.startingTime;
    var ending = $scope.ngDialogData.endingTime;
    var error = $scope.ngDialogData.error;
    var originalId = $scope.ngDialogData.originalId;
    var newTitle = $scope.ngDialogData.newTitle;

    // title
    ctrl.title = 'Inserisci nuovo blocco di disponibilità';
    ctrl.button = 'Salva nuova';
    if (originalId) {
        ctrl.title = 'Modifica disponibilità';
        ctrl.button = 'Salva modifica';
    }

    // error
    if (error) ctrl.error = error;

    // default start / end
    if (starting) {
        var s = moment(starting);
        now.hours(s.hours()).minutes(s.minutes());
    }
    if (ending) {
        var e = moment(ending);
        then.hours(e.hours()).minutes(e.minutes());
    };

    // bindings
    ctrl.confirm = confirm;
    ctrl.timePickerStart = new Date(now._d.getTime());
    ctrl.timePickerEnd = new Date(then._d.getTime());
    ctrl.constrainPickers = constrainPickers;

    console.log(ctrl.timePickerStart, ctrl.timePickerEnd);

    // helpers
    function confirm ()
    {
        var start = moment(ctrl.timePickerStart);
        var end = moment(ctrl.timePickerEnd);
        $scope.confirm({
            id: originalId,
            start: { hours: start.hours(), minutes: start.minutes() },
            end: { hours: end.hours(), minutes: end.minutes() }
        });
    }

    function constrainPickers (from)
    {
        var start = moment(ctrl.timePickerStart);
        var end = moment(ctrl.timePickerEnd);
        var startHours = start.hours();
        var startMinutes = start.minutes();
        var endHours = end.hours();
        var endMinutes = end.minutes();
        var endIsMidnight = endHours == 0 && endMinutes == 0;
        if (from == 'start' && startHours == endHours && startMinutes == endMinutes) {
            end.add(30, 'minutes')
            setTimepicker('end', end.hours(), end.minutes());
        } else if (from == 'end' && ((startHours == endHours && endMinutes <= startMinutes) || (endHours < startHours && endMinutes > 0))) {
            start = moment(end);
            start.subtract(30, 'minutes');
            setTimepicker('start', start.hours(), start.minutes());
        } else if (from == 'end' && (startHours > 0) && ((endHours == 0 && endMinutes == 30) || (endHours == 1 && endMinutes == 0))) {
            start = moment(end);
            start.hours(0).minutes(0);
            setTimepicker('start', start.hours(), start.minutes());
        } else if (from == 'start' && startHours > endHours && !endIsMidnight ) {
            end = moment(start);
            end.add(30, 'minutes');
            setTimepicker('end', end.hours(), end.minutes());
        }
        $log.log('[ADD_AVAIL_MODAL_CTRL] Constrain end time');
    }

    function setTimepicker (picker, hours, minutes)
    {
        $timeout( function () {
            var d = moment().hours(hours).minutes(minutes).seconds(0).milliseconds(0);
            if (picker == 'start') ctrl.timePickerStart = new Date (d._d.getTime());
            else if (picker == 'end') ctrl.timePickerEnd = new Date (d._d.getTime());
        });
    }

}
