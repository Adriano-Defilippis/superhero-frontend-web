/*global $:false, angular:false, console:false */
'use strict';

export default function CalendarAppoinmentsController (
    $scope, $compile, $timeout, $rootScope, ngDialog, CalendarService, uiCalendarConfig
) {
    "ngInject";

    var self = this,
        calendarRes = null,
        calendarAvail = null,
        popup = $('#popup'),
        eventSelected = null,
        scrollerAvail = null,
        scrollerRes = null,
        breakPoint = 600,
        showAvail = $scope.$parent.ctrl.showCalAvailability,
        showNightPeriod = $scope.$parent.ctrl.showNightPeriod,
        initialized = false;

    CalendarService.setCalendarScope($scope);

    $scope.eventsResRes =   CalendarService.events.fg.res;
    $scope.eventsAvailRes = CalendarService.events.bg.avail;
    $scope.eventsReqRes =   CalendarService.events.fg.req;
    $scope.eventsResAvail = CalendarService.events.bg.res;
    $scope.eventsAvailAvail = CalendarService.events.fg.avail;
    $scope.eventsReqAvail = CalendarService.events.bg.req;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    $timeout(function(){
      calendarRes = angular.element('#calReserved');
      //calendarRes = uiCalendarConfig.calendars.calReserved;
      calendarAvail = angular.element('#calAvailability');
      //calendarAvail = uiCalendarConfig.calendars.calAvailability;
      bindScrolling();
      changedShownPeriod();
    });

    $scope.eventSourcesRes = [$scope.eventsResRes, $scope.eventsAvailRes, $scope.eventsReqRes];
    $scope.eventSourcesAvail = [$scope.eventsResAvail, $scope.eventsAvailAvail, $scope.eventsReqAvail];

    $scope.refreshEvents = function(){
      $scope.eventSourcesRes.length = 0;
      $scope.eventSourcesAvail.length = 0;
      $scope.eventSourcesRes = [$scope.eventsResRes, $scope.eventsAvailRes, $scope.eventsReqRes];
      $scope.eventSourcesAvail = [$scope.eventsResAvail, $scope.eventsAvailAvail, $scope.eventsReqAvail];
    }

    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };

    $scope.calPrev = function(){
      calendarRes.fullCalendar('prev');
      calendarAvail.fullCalendar('prev');
    }

    $scope.calNext = function(){
      calendarRes.fullCalendar('next');
      calendarAvail.fullCalendar('next');
    }

    if(Modernizr.touch){
      //Swipe
      var hammer = new Hammer($('html')[0]);
      hammer.on("swipeleft", function() {
        $scope.calNext();
      });

      hammer.on("swiperight", function() {
        $scope.calPrev();
      });
    }


    $scope.deleteAvailability = function(id){
      CalendarService.availabilityDeleted(id);
    }

    $scope.confirmSelection = function(){
      if(eventSelected !== null){
        CalendarService.availabilityAdded(eventSelected.start.toDate(), eventSelected.end.toDate());
      }
      eventSelected = null;
      calendarAvail.fullCalendar('unselect');
    }

    $scope.confirmRequest = function(id){
      CalendarService.confirmRequest(id);
    }

    $scope.showAppointmentInfo = function(id){
      CalendarService.showAppointmentDetail(id);
    }

    $scope.openAvailabilitySettings = function (availId)
    {
        CalendarService.triggerMobileAvailSettingsModal(availId);
    }

    $scope.editMobileAvailability = function (availId)
    {
        var availData = CalendarService.getAvailData(availId);
        console.log(availData);
        CalendarService.triggerMobileAvailabilityModal(availId, availData.start, availData.end);
    }

    $scope.$on('polled', function(){
      reRenderCalendars();
    });

    $scope.calendarConfig = {
      calendarRes:{
        lang: 'it',
        height: 1000,
        titleFormat: 'D MMMM YYYY',
        buttonIcons: { prev: 'left-arrow', next: 'right-arrow' },
        axisFormat: 'HH:mm',
        columnFormat: 'D/M dd',
        editable: false,
        firstDay: 1,
        defaultView: 'agendaWeek',
        allDaySlot: false,
        slotDuration: '00:30:00',
        snapDuration: '01:00:00',
        minTime: '00:00:00',
        timezone: 'local',
        selectHelper: false,
        selectOverlap: false,
        eventOverlap: false,
        selectConstraint: { start: '00:00', end: '24:00',  dow: [ 0, 1, 2, 3, 4, 5, 6 ] },
        header:{ left: '', center: 'title', right: '' },
        selectable: false,
        unselectCancel: '.fc-helper',
        viewRender: viewRenderRes,
        eventRender: eventRenderRes,
      },
      calendarAvail: {
        lang: 'it',
        height: 1000,
        titleFormat: 'D MMMM YYYY',
        buttonIcons: { prev: 'left-arrow', next: 'right-arrow' },
        axisFormat: 'HH:mm',
        columnFormat: 'D/M dd',
        editable: true,
        firstDay: 1,
        defaultView: 'agendaWeek',
        allDaySlot: false,
        slotDuration: '00:30:00',
        snapDuration: '00:30:00',
        minTime: '00:00:00',
        timezone: 'local',
        selectHelper: true,
        selectOverlap: selectOverlap,
        eventOverlap: overlapLogic,
        selectConstraint: { start: '00:00', end: '24:00',  dow: [ 0, 1, 2, 3, 4, 5, 6 ] },
        header:{ left: '', center: 'title', right: '' },
        selectable: true,
        select: calendarSelect,
        unselect: calendarUnselect,
        unselectCancel: '.fc-helper',
        viewRender: viewRenderAvail,
        eventRender: eventRenderAvail,
        //eventAfterRender: function(event, element, view){ $compile(element)($scope); },
        eventResize: eventResizeAvail,
        //eventResizeStart: eventResizeStartAvail,
        //eventDragStart: eventDragStartAvail,
        eventDrop: eventDropAvail
      }
    };

    $scope.reRenderCalendars = function(){
      reRenderCalendars();
    }

    function startPolling(){
      CalendarService.startPoll();
    }

    function stopPolling(){
      CalendarService.pausePoll();
    }

    function bindScrolling(){
      // binds the scrolling of the two calendars
      scrollerAvail = angular.element('.cal-availability .fc-scroller');
      scrollerRes = angular.element('.cal-reserved .fc-scroller');
      var delay = 200;
      var timeout = null;
      scrollerRes.bind('scroll', function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          if(!$scope.$parent.ctrl.showCalAvailability)
            scrollerAvail.scrollTop(scrollerRes.scrollTop());
        }, delay);
      });
      scrollerAvail.bind('scroll', function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          if($scope.$parent.ctrl.showCalAvailability)
            scrollerRes.scrollTop(scrollerAvail.scrollTop());
        }, delay);
      });
    }

    // Cal res functions
    function viewRenderRes(){
      bindScrolling();
      angular.element('#calReserved').fullCalendar( 'refetchEvents' );
      //changedShownPeriod(calendarRes);
    }

    function eventRenderRes(event, element, view) {
      var startTime = event.start.format('HH:mm');
      var endTime = event.end.format('HH:mm');
      var diff = ((event.end - event.start)/1000/60);
      var small = diff <= 60;
      var service = event.service !== undefined ? event.service : 0;
      if(event.type === 'req' && event.stato == "Attiva"){
        if(event.start.toDate().getTime() < new Date().getTime()) {
          element.html('');
          return element;
        }

        var html =
            '<div class="fc-content request">' +
              '<div ng-click="confirmRequest(\''+event.id+'\')" class="request service-'+service+(small ? ' small' : '')+'" fill column>'+
                //'<span class="time-info">'+startTime+'</span>'+
                //'<h4 layout="column" layout-align="center center">'+ event.title +'</h4>'+
                '<div><p class="center"><span class="center glyphicon glyphicon-pushpin"></span></p></div>' +
                //'<span class="glyphicon glyphicon-pushpin"></span>'+
                //'<span class="time-info">'+endTime+'</span>'+
              '</div>' +
            '</div>' +
            '<div class="fc-bg"></div>';
        element.html(html);
        $compile(element)($scope);
        return element;
      } else if(event.type === 'res' && ( event.stato == "Confermato" || event.stato == "Pagato" || event.stato == "ErrorePagamento" )){
        var html =
            '<div class="fc-content">' +
              '<div fill ng-click="showAppointmentInfo(\''+event.id+'\')" class="reservation z-depth-1 service-'+service+(small ? ' small' : '')+'" '+(small ? 'row' : 'column')+'>'+
                (small ? '' : '<p>')+'<span class="center time-info">'+startTime+'</span>'+(small ? '' : '</p>') +
                (small ? '' : '<p>')+'<span class="center"><span class="center glyphicon glyphicon-info-sign"></span></span>'+(small ? '' : '</p>') +
                (small ? '' : '<p>')+'<span class="center time-info">'+endTime+'</span>'+(small ? '' : '</p>') +
              '</div>' +
            '</div>' +
            '<div class="fc-bg"></div>';
        element.html(html);
        $compile(element)($scope);
        return element;
      } else if(event.type == 'res' && event.stato != "Confermato") {
        return false;
      }
    }

    // cal avail functions
    function eventRenderAvail(event, element, view) {
      var isMobile = Modernizr.touch;
      var diff = ((event.end - event.start)/1000/60);
      var medium = diff <= 60;
      var small = diff <= 30;
      if(event.type == 'res' && event.stato != 'Confermato' && event.stato != 'Pagato'){
        return false;
      }
      if(event.type === 'avail'){
        var icon = isMobile ? '<i class="mdi-action-settings"></i>' : '<span class="glyphicon glyphicon-trash"></span>';
        var editIcon = '<i class="mdi-image-edit" ng-click="openAvailabilitySettings(\''+ event.id +'\')"></i>';
        var editAction = 'ng-click="openAvailabilitySettings(\''+ event.id +'\')"';
        var deleteIcon = '<span class="glyphicon glyphicon-trash" ng-click="deleteAvailability(\''+ event.id +'\')"></span>';
        var deleteAction = 'ng-click="deleteAvailability(\''+ event.id +'\')"';
        var settingsIcon = '<i class="mdi-action-settings"></i>';
        var settingsAction = 'ng-click="openAvailabilitySettings(\''+ event.id +'\')"';

        var actions = isMobile ? settingsIcon : deleteIcon;
        var action = isMobile ? settingsAction : deleteAction;

        var html =
           '<div class="fc-content">'+
              '<div class="delete-availability'+(small ? ' small-avail' : '')+' '+(isMobile ? ' is-mobile' : ' is-desktop')+' center" fill '+action+' valign-wrapper>'+
                '<p fill valign class="center">'+actions+'</p>'+
              '</div>'+
            '</div>' +
            '<div class="fc-bg"></div>' +
            (!isMobile ? '<div class="fc-resizer"></div>' : '');
        element.html(html);
        $compile(element)($scope);
      } else if(event.type !== "res") {
        var startTime = event.start.format('HH:mm');
        var endTime = event.end.format('HH:mm');
        var html =
            '<div class="fc-content" ng-click="confirmSelection()">' +
              '<div class="fc-time fc-time-span'+(small || medium ? ' small-req' : '')+'" fill column data-start="'+startTime+'" data-full="'+startTime+' - '+endTime+'">'+
                (small || medium ? '' : '<p class="center"><span class="center">'+startTime+'</span></p>')+
                '<div><p class="center"><span class="glyphicon glyphicon-plus-sign"></span></p></div>' +
                (small || medium ? '' : '<p class="center"><span class="center">'+endTime+'</span></p>')+
              '</div>' +
            '</div>' +
            '<div class="fc-bg"></div>';
        element.html(html);
        $compile(element)($scope);
      } else if(event.type === 'req'){
        return false;
      }
    }

    function viewRenderAvail(){
      bindScrolling();
      changedShownPeriod(calendarAvail);
    }

    function eventResizeAvail( event, delta, revertFunc, jsEvent, ui, view ) {
      startPolling();
      CalendarService.availabilityEdited( event.id, event, revertFunc );
    }

    function eventResizeStartAvail(){
      stopPolling();
    }

    function eventDragStartAvail(){
      stopPolling();
    }

    function eventDropAvail( event, delta, revertFunc, jsEvent, ui, view ){
      startPolling();
      CalendarService.availabilityEdited( event.id, event, revertFunc );
    }

    function calendarSelect(start, end, allDay, ev){
        var hoursSpan = CalendarService.selectedHoursSpan;
        var mustUseTimeSpans = $(window).width() <= breakPoint;
        if (end.diff(start, 'hours') < hoursSpan && mustUseTimeSpans) {
            var cal = angular.element('#calAvailability');
            var newEnd = moment(start).add(hoursSpan, 'hours');

            // check if selection collides with others
            var rangeNewSelection = moment.range(start, newEnd);
            var collideAvail = _.some(CalendarService.events.fg.avail, _ev => {
                let rangeEvent = moment.range(moment(_ev.start), moment(_ev.end));
                if (rangeNewSelection.overlaps(rangeEvent)) console.log('avail', _ev);
                return rangeNewSelection.overlaps(rangeEvent)
            });

            var collideEvents = _.some(CalendarService.events.bg.res, _ev => {
                let rangeEvent = moment.range(moment(_ev.start), moment(_ev.end));
                let isActive = _ev.stato == "Confermato" || _ev.stato == "Pagato";
                return rangeNewSelection.overlaps(rangeEvent) && isActive;
            });

            if (collideAvail === true || collideEvents === true) {
                // insert colliding error here
                showMobileCollidingError();
                cal.fullCalendar( 'unselect' );
            } else {
                cal.fullCalendar( 'unselect' );
                cal.fullCalendar( 'select', start, newEnd);
            }
        } else {
            eventSelected = {
              start: start,
              end: end
            };
        }

      //if(isSelectionDuringNight(start, end)){
      //  fitSelectionInNightPeriod(start, end);
      //}
      /*var startTime = start.format('HH:mm');
      var endTime = end.format('HH:mm');
      var el = $('.fc-helper .fc-content');
      var wrapper = $('.main-content');
      var css = {
        top: el.offset().top - wrapper.offset().top,
        left: el.offset().left - wrapper.offset().left,
        height: el.outerHeight(),
        width: el.outerWidth(),
        opacity: 1
      };
      var html =  '<div class="avail-confirm fc-time-span" ' +
                  'layout-fill layout-align="space-between center" layout="column" ' +
                  'ng-click="confirmSelection()">' +
                    '<span>'+startTime+'</span>'+
                    '<span class="glyphicon glyphicon-plus-sign"></span>' +
                    '<span>'+endTime+'</span>'+
                  '</div>';

      popup.append(html);
      popup.css(css);
      $compile(popup)($scope);*/
    }

    function showMobileCollidingError () {
        ngDialog.open({
            plain: true,
            template: `
                <div id="add-avail-block">
                    <h4 class="no-margin all center"><b>Attenzione, non puoi sovrapporre fasce di disponibilità.</b></h4>
                    <div class="row no-margin all">
                        <div class="col s8 offset-s2">
                            <p class="center no-margin bottom">
                                <a type="button" ng-click="closeThisDialog()" full-width class="margin-bottom-small waves-effect waves-main-orange white btn btn-small btn-flat">Chiudi</a>
                            </p>
                        </div>
                    </div>
                </div>
            `,
            controller: function () {},
            className: 'ngdialog-theme-default ngdialog-bottom-sheet',
            closeByDocument: true,
            showClose: true
        });
    }

    function fitSelectionInNightPeriod(start, end){
      var newStart = moment(start);
      var newEnd = moment(end);
      var startNight = 0;
      var endNight = 6;
      var startHour = start.hours();
      var startMinute = start.minutes();
      var endHour = end.hours();
      var endMinute = end.minutes();

      var startOffset = startNight - startHour;
      if(startOffset < 0 || (startOffset === 0 && startMinute > 0)){
        newStart.hours(0).minutes(0).seconds(0);
      }

      var endOffset = endNight - endHour;
      if(endOffset > 0) {
        newEnd.hours(6).minutes(0).seconds(0);
      }

      calendarAvail.fullCalendar( 'unselect' );
      calendarAvail.fullCalendar( 'select', newStart, newEnd );
    }

    function isSelectionDuringNight(start, end){
      var startNight = 0;
      var endNight = 6;

      var startHour = start.hours();
      var startMinute = start.minutes();

      var endHour = end.hours();
      var endMinutes = end.minutes();

      if( startHour === 0 && startMinute === 0 && endHour === 6 && endMinutes === 0 ) // from 0:00 to 6:00
        return false;

      var startOverlap = ( startHour >= startNight && startHour < endNight ); // start between 0 and 5
      var endOverlap = ( endHour >= startNight && endHour < endNight ); // end between 0 and 5

      if( startOverlap && endOverlap )
        return true;

      if( ( startHour == startNight && startMinute > 0 ) || (startHour > startNight && startHour < endNight) )
        return true;

      if( endHour < endNight )
        return true;

      return false;
    }

    function calendarUnselect( view, jsEvent ){
      //resetPopup();
      eventSelected = null;
    }

    function resetPopup(){
      popup.html('');
      popup.removeAttr('style');
    }

    // general functions
    function overlapLogic(stillEvent, movingEvent) {
      return stillEvent.type == "req" || (stillEvent.type == "res" && stillEvent.stato != "Confermato" && stillEvent.stato != "Pagato");
    }

    function selectOverlap (stillEvent, movingEvent) {
        return stillEvent.type == "req" || (stillEvent.type == "res" && stillEvent.stato != "Confermato" && stillEvent.stato != "Pagato");
    }

    function changedShownPeriod(ins){
      var shown = getMinMax();
      CalendarService.calendarHasChangedView(shown.start, ins);
    }

    function syncMinMax(){
      //calendar.fullCalendar( 'gotoDate', CalendarService.getCurrentMin() );
    }

    function getMinMax(){
      var view = angular.element('#calReserved').fullCalendar( 'getView' );
      var start = view.start;
      var end = view.end;
      return { start: start, end: end };
    }

    initResCalendar();
    //if(!Modernizr.touch){
    initAvailCalendar();
    //}

    //
    // NEW FUNCTIONS
    //

    function initResCalendar(){
      angular.element('#calReserved').fullCalendar({
        eventSources: [
          { events: function(start, end, timezone, callback){ callback(CalendarService.events.fg.res) } },
          { events: function(start, end, timezone, callback){ callback(CalendarService.events.bg.avail) } },
          { events: function(start, end, timezone, callback){ callback(CalendarService.events.fg.req) } }
        ],
        lazyFetching: false,
        lang: 'it',
        height: Modernizr.touch ? 500 : 1000,
        titleFormat: 'D MMMM YYYY',
        buttonIcons: { prev: 'left-arrow', next: 'right-arrow' },
        axisFormat: 'HH:mm',
        columnFormat: 'D/M dd',
        editable: false,
        firstDay: 1,
        defaultView: 'agendaWeek', //$(window).width() > breakPoint ? 'agendaWeek' : 'agendaDay',
        allDaySlot: false,
        slotDuration: '00:30:00',
        snapDuration: '01:00:00',
        minTime: '00:00:00',
        timezone: 'local',
        selectHelper: false,
        selectOverlap: false,
        eventOverlap: false,
        selectConstraint: { start: '00:00', end: '24:00',  dow: [ 0, 1, 2, 3, 4, 5, 6 ] },
        header:{ left: '', center: 'title', right: '' },
        selectable: false,
        unselectCancel: '.fc-helper',
        viewRender: viewRenderRes,
        eventRender: eventRenderRes,
        businessHours: {
            start: '7:00',
            end: '21:00',
            dow: [ 0, 1, 2, 3, 4, 5, 6 ]
        }
      });
    }

    function initAvailCalendar(){
      angular.element('#calAvailability').fullCalendar({
        eventSources: [
          { events: function(start, end, timezone, callback){ callback(CalendarService.events.bg.res) } },
          { events: function(start, end, timezone, callback){ callback(CalendarService.events.fg.avail) } },
          { events: function(start, end, timezone, callback){ callback(CalendarService.events.bg.req) } }
        ],
        lazyFetching: false,
        lang: 'it',
        height: Modernizr.touch ? 500 : 1000,
        titleFormat: 'D MMMM YYYY',
        buttonIcons: { prev: 'left-arrow', next: 'right-arrow' },
        axisFormat: 'HH:mm',
        columnFormat: 'D/M dd',
        editable: true,
        firstDay: 1,
        defaultView: 'agendaWeek',//$(window).width() > breakPoint ? 'agendaWeek' : 'agendaDay', //agendaDay
        allDaySlot: false,
        slotDuration: '00:30:00',
        snapDuration: '00:30:00',
        minTime: '00:00:00',
        timezone: 'local',
        selectHelper: true,
        selectOverlap: selectOverlap,
        eventOverlap: overlapLogic,
        selectConstraint: { start: '00:00', end: '24:00',  dow: [ 0, 1, 2, 3, 4, 5, 6 ] },
        header:{ left: '', center: 'title', right: '' },
        selectable: true,
        select: calendarSelect,
        unselect: calendarUnselect,
        unselectCancel: '.fc-helper',
        viewRender: viewRenderAvail,
        eventRender: eventRenderAvail,
        //eventAfterRender: function(event, element, view){ $compile(element)($scope); },
        eventResize: eventResizeAvail,
        eventResizeStart: eventResizeStartAvail,
        eventDragStart: eventDragStartAvail,
        eventDrop: eventDropAvail,
        businessHours: {
          start: '7:00',
          end: '21:00',
          dow: [ 0, 1, 2, 3, 4, 5, 6 ]
        }
      });
    }

    function reRenderCalendars(){
      angular.element('#calReserved').fullCalendar( 'refetchEvents' );
      angular.element('#calAvailability').fullCalendar( 'refetchEvents' );
    }

  }
