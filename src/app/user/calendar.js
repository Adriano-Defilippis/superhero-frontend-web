'use strict';

export default function UserCalendarCtrl (
    $scope, $compile, $timeout, User, uiCalendarConfig, UserCalendarService, Services
) {
    "ngInject";

  	var self = this,
        calendar = angular.element('#calClient');

    //$scope.events = UserCalendarService.appointments;

    calendar.fullCalendar({
      eventSources: [
        { events: function(start, end, timezone, callback){ callback(UserCalendarService.appointments) } },
      ],
      lazyFetching: false,
      lang: 'it',
      height: 'auto',
      titleFormat: 'MMMM YYYY',
      buttonIcons: { prev: 'left-arrow', next: 'right-arrow' },
      //columnFormat: 'D/M dd',
      editable: false,
      firstDay: 1,
      defaultView: 'month',
      minTime: '00:00:00',
      timezone: 'local',
      header:{ left: '', center: 'title', right: '' },
      selectable: false,
      //viewRender: viewRenderRes,
      eventRender: eventRender,
    });

    $scope.eventSources = [$scope.events];

    $timeout(function(){
      //calendar = uiCalendarConfig.calendars.calClient;
      UserCalendarService.setCalInstance(calendar);
    });

    self.showAppointmentInfo = function(id){
      User.showAppointmentDetail(id);
    }

    function eventRender(event, element, view) {
      if(event.stato == 'Aperto' || event.stato == 'Confermato' || event.stato == 'Pagato' || event.stato == 'Cancellato' || event.stato == 'SuperHeroNotFound' || event.stato == 'ErrorePagamento'){
        var startTime = event.start.format('HH:mm');
        var endTime = event.end.format('HH:mm');
        var serviceLabel = Services.LabelFromNumber(event.type);
        var titleLabel = serviceLabel+': '+startTime+' - '+endTime;
        var eventClass = '';
        var action = 'ng-click="ctrl.showAppointmentInfo(\''+event.id+'\')"';
        if(event.stato == 'Confermato' || event.stato == 'Pagato' || event.stato == 'ErrorePagamento') {
          eventClass = 'confirmed';
        } else if(event.stato == 'Cancellato' || event.stato == 'SuperHeroNotFound') {
          eventClass = 'deleted';
          action = '';
          if(event.stato == 'Cancellato') titleLabel = 'Cancellato';
          else titleLabel = 'Supereroe non trovato';
        } else {
          eventClass = 'processing';
        }
        var html =
          '<div class="fc-content service-'+event.type+' single-event '+eventClass+'" '+action+' title="'+titleLabel+'">' +
            //'<div fill ng-click="confirmRequest(\''+event.id+'\')" class="request md-whiteframe-zasd service-'+service+(small ? ' small' : '')+'" layout="'+(small ? 'row' : 'column')+'" layout-align="space-around center">'+
              //'<span class="time-info">'+startTime+'</span>'+
              //'<h4 layout="column" layout-align="center center">'+ event.title +'</h4>'+
              '<span class="glyphicon">&nbsp;</span>' +
              //'<span class="time-info">'+endTime+'</span>'+
            //'</div>' +
          '</div>';
          //'<div class="fc-bg"></div>';
        element.html(html);
        $compile(element)($scope);
      } else {
        return false;
      }
    }

    $scope.calPrev = function(){
      calendar.fullCalendar('prev');
    }

    $scope.calNext = function(){
      calendar.fullCalendar('next');
    }

}
