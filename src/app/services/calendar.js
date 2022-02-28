/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function CalendarService (
    $rootScope, $filter, RestService, NotifyService, $timeout, $q, $interval, Services, ngDialog, $log
){
    "ngInject";

    var self = this,
        idHero = 'SH-22222222-2222-2222-2222',
        minShown,// = moment('01/01/2015'),
        maxShown,// = moment('12/31/2015'),
        lastMin,//= moment('01/01/2015'),
        lastMax,//= moment('12/31/2015');
        CalendarScope,
        pollingTimeout,
        pollingDelay = 20;

    self.selectedHoursSpan = 2;
    self.mustUseSelectedSpan = false;

    // Events model
    self.events = {
    	fg: { res: [], req: [], avail: [] },
    	bg: { res: [], req: [], avail: [] },
      sidebar: { req: [], res: [] }
    };

    //var ppp = RestService.getHeroes();
    //ppp.then(function(data){
    //  console.info(data);
    //});

    // Options
    var options = {
      bgColorAvailDefault: '#fff',
      bgColorAvail: '#fff',
      bgColorRes: 'rgba(238, 105, 60, 0.3);',
      connectionError: {title:"Errore connessione con il server", content:"C'è stato un errore di connessione con il server. Riprova più tardi."}
    }

    // service map
    var serviceMap = {
        Colf: 1,
        Badante: 2,
        BabySitter: 3
    }

    var serviceName = {
      'TS-0000-0000-0000-0001': 'Badante',
      'TS-0000-0000-0000-0003': 'Colf',
      'TS-0000-0000-0000-0002': 'Baby Sitter',
    }

    self.loading = false;

    self.setHeroId = function(heroId){
    	idHero = heroId;
    }

    self.calendarHasChangedView = function(min, instance){
      if(!isDateInShownPeriod(min)){
        setLoading(true);
      	setPeriod(min);
        var p = getDataFromServer(true, null, instance);
        p.then(function(){
          setLoading(false);
        });
      }
    }

    self.availabilityEdited = function(id, event, revertFunc){
        editAvailability(id, event, revertFunc);
    }

    self.availabilityDeleted = function(id){
        deleteAvailability(id);
    }

    self.availabilityAdded = function(start, end){
        addAvailability(start, end);
    }

    self.showAppointmentDetail = function(id){
      NotifyService.showAppointmentDetail(idHero, id);
    }

    self.confirmRequest = function(id, fromSidebar){
      var data;
      if(fromSidebar){
        data = _.find(self.events.sidebar.req, function(req){
          return req.id == id;
        });
      } else {
        data = _.find(self.events.fg.req, function(req){
          return req.id == id;
        });
      }

      console.debug(data);

      NotifyService.confirmRequest(data, function(rejected){
        setLoading(true);
        if(!rejected){
          confirmRequest(id, function(){
            $timeout(function(){
              var p = getDataFromServer(true, null, null);
              p.then(function(){
                getSidebarData();
                setLoading(false);
              });
            }, 6000);
          });
        } else {
          var p = rejectRequest(id);
          p.then(function(){
            setLoading(false);
          });
        }
      });
    }

    self.getSidebarData = function(){
       getSidebarData();
    }

    self.getServiceName = function(id){
      return Services.Label(id);
    }

    self.injectData = function(res, req, avails){
      pushEventsInModel(req, 'req');
      pushEventsInModel(avails, 'avail');
      pushEventsInModel(res, 'res');
      var now = new Date().getTime();
      self.events.sidebar.req.length = 0;
      req.forEach(function(single){
        if(single.dataInizio >= now)
          self.events.sidebar.req.push(formatSideRequest(single));
      });
      self.events.sidebar.res.length = 0;
      res.forEach(function(single){
        if(single.dataInizio >= now)
          self.events.sidebar.res.push(formatSideAppointment(single));
      });
    }

    self.setCalendarScope = function(scope){
      CalendarScope = scope;
    }

    self.startPoll = function(force){
      startPolling(force);
    }

    self.pausePoll = function(){
      pausePolling();
    }

    $rootScope.$on("ContactCenterDeletedAppointment", function(ev, id){
      cancelEvent(id);
    });


    self.checkCollisionWithAvailability = checkCollisionWithAvailability;
    self.checkCollisionWithAppointments = checkCollisionWithAppointments;
    self.getDisplayedDateInCalendar = getDisplayedDateInCalendar;
    self.triggerMobileAvailabilityModal = triggerMobileAvailabilityModal;
    self.triggerMobileAvailSettingsModal = triggerMobileAvailSettingsModal;
    self.createEpoch = createEpoch;
    self.getAvailData = getAvailData;

    function getAvailData (availId)
    {
        var found = _.find(self.events.bg.avail, function(a) {
            return a.id == availId;
        });

        if (found) {
            return found;
        }
    }

    function triggerMobileAvailSettingsModal (id)
    {
        ngDialog.open({
            template: 'app/modals/edit-availability-block.modal.html',
            controller: 'editAvailCtrl',
            controllerAs: 'ctrl',
            className: 'ngdialog-theme-default ngdialog-bottom-sheet',
            closeByDocument: true,
            showClose: false,
            data: {
                originalId: id,
            }
        });
    }

    function triggerMobileAvailabilityModal (id, startingTime, endingTime, error)
    {
        getDisplayedDateInCalendar().then(function(d){
            ngDialog.openConfirm({
                template: 'app/modals/add-availability-block.modal.html',
                controller: 'addAvailCtrl',
                controllerAs: 'ctrl',
                className: 'ngdialog-theme-default ngdialog-bottom-sheet',
                closeByDocument: true,
                data: {
                    date: d,
                    originalId: id,
                    startingTime: startingTime,
                    endingTime: endingTime,
                    error: error
                }
            }).then(processModalData);
        });
    }

    function processModalData (data)
    {
        $log.log('[CALENDAR_SERVICE] Processing data from modal', data);
        let startEpoch = createEpochFromAvailId(data.start, data.id);
        let endEpoch = createEpochFromAvailId(data.end, data.id, data.end.hours == 0 && data.end.minutes == 0);
        console.log(startEpoch, endEpoch);

        var availCollider = checkCollisionWithAvailability({id: data.id, start: startEpoch, end: endEpoch});
        var resCollider = checkCollisionWithAppointments({id: data.id, start: startEpoch, end: endEpoch});

        if (availCollider) {
            var from = moment(availCollider.start).format('HH:mm');
            var to = moment(availCollider.end).format('HH:mm');
            triggerMobileAvailabilityModal(undefined, startEpoch, endEpoch, 'Attenzione! Non è possibile sovrapporre disponibilità. È già presente una disponibilità dalle '+from+' alle '+to+'.');
        } else if (resCollider) {
            var from = moment(resCollider.start).format('HH:mm');
            var to = moment(resCollider.end).format('HH:mm');
            triggerMobileAvailabilityModal(undefined, startEpoch, endEpoch, 'Attenzione! Non è possibile salvare la disponibilità poichè è già presente un appuntamento confermato dalle '+from+' alle '+to+'.');
        } else {
            if (data.id) {
                // save edited block
                editAvailability(data.id, {start: moment(startEpoch), end: moment(endEpoch)});
            } else {
                // save new block
                addAvailability(new Date(startEpoch), new Date(endEpoch));
            }
        }
    }

    function checkCollisionWithAvailability (block)
    {
        var collider, collided = false;
        self.events.bg.avail.forEach(function (b) {
            var rangeA = moment().range(block.start, block.end);
            var rangeB = moment().range(b.start, b.end);
            if(rangeA.overlaps(rangeB) && b.id != block.id) {
                console.log(block, b);
                collider = b;
                collided = true;
            }
        });

        if (collided) return collider;
        else return false;
    }

    function checkCollisionWithAppointments (block)
    {
        var collider, collided = false;
        self.events.bg.res.forEach(function (b) {
            var rangeA = moment().range(block.start, block.end);
            var rangeB = moment().range(b.start, b.end);
            if(rangeA.overlaps(rangeB) && b.id != block.id) {
                collider = b;
                collided = true;
            }
        });

        if (collided) return collider;
        else return false;
    }

    function getDisplayedDateInCalendar ()
    {
        return $timeout(function() {
            var date = angular.element('#calReserved').fullCalendar( 'getDate' ).dayOfYear();
            console.log(date);
            return date;
        });
    }

    function createEpoch (data, forceTomorrow)
    {
        var e = getDisplayedDateInCalendar().then(function (d){
            var h = data.hours;
            var m = data.minutes;
            if (typeof forceTomorrow != 'undefined' && forceTomorrow === true) d += 1;
            var now = moment().dayOfYear(d).hours(h).minutes(m).seconds(0).milliseconds(0);
            var epoch = now._d.getTime();
            return epoch;
        });
        return e;
    }

    function createEpochFromAvailId (data, availId, forceTomorrow = false) {
        let deferred = $q.defer();
        let avail = _.find(self.events.bg.avail, { id: availId });
        let newDate = moment(avail.start).hours(data.hours).minutes(data.minutes).seconds(0).milliseconds(0);
        if (forceTomorrow === true) newDate.add(1, 'days');
        return newDate._d.getTime();
    }

    //getDataFromServer(true, null, null);

    function cancelEvent(eventId){
      var evFg = _.find(self.events.fg.res, function(e){
        return e.id == eventId;
      });
      evFg.stato = 'Cancellato';

      var evBg = _.find(self.events.bg.res, function(e){
        return e.id == eventId;
      });
      evBg.stato = 'Cancellato';

      var evSide = _.find(self.events.sidebar.res, function(e){
        return e.id == eventId;
      });
      evSide.stato = 'Cancellato';

      CalendarScope.reRenderCalendars();
    }

    function startPolling(force){
      if(force){
        $timeout(function(){
          var p = getDataFromServer(true, null, null);
          $rootScope.$broadcast('polled');
        });
      }

      pollingTimeout = $interval(function(){
        var p = getDataFromServer(true, null, null);
        getSidebarData();
        $rootScope.$broadcast('polled');
      }, 1000*pollingDelay);
    }

    function pausePolling(){
      $interval.cancel(pollingTimeout);
    }

    function getSidebarData(){
      var today = moment().format('DDMMYYYY');
      var future = moment().add(12, 'month').format('DDMMYYYY');
      var p = RestService.getHeroAppointRequests(idHero, { dataInizioMin: today, dataInizioMax: future });
      p.then(function(data){
        if(data.status === 200){
          self.events.sidebar.req.length = 0;
          data.data.forEach(function(single){
            self.events.sidebar.req.push(formatSideRequest(single.plain()));
          });
          return RestService.getHeroAppointments(idHero, { dataInizioMin: today, dataInizioMax: future });
        }
      }).then(function(data){
        if(data.status === 200){
          self.events.sidebar.res.length = 0;
          data.data.forEach(function(single){
            self.events.sidebar.res.push(formatSideAppointment(single.plain()));
          });
        }
      });
    }

    function confirmRequest(id, callback){
      var p = RestService.confirmHeroRequest(idHero, id);
      p.then(function(data){
        if(data.status == 201 || data.satus == 200){
          _.remove(self.events.sidebar.req, function(n) {
            return n.id == id;
          });
          _.remove(self.events.fg.req, function(n) {
            return n.id == id;
          });
          _.remove(self.events.bg.req, function(n) {
            return n.id == id;
          });
          callback();
        } else {
          NotifyService.modal(options.connectionError);
        }
      });
    }

    function rejectRequest(id){
      var deferred = $q.defer();
      var p = RestService.rejectHeroRequest(idHero, id);
      p.then(function(data){
        if(data.status == 201 || data.satus == 200){
          _.remove(self.events.sidebar.req, function(n) {
            return n.id == id;
          });
          _.remove(self.events.fg.req, function(n) {
            return n.id == id;
          });
          _.remove(self.events.bg.req, function(n) {
            return n.id == id;
          });
          CalendarScope.reRenderCalendars();
          deferred.resolve(true);
        } else {
          NotifyService.modal(options.connectionError);
        }
      });
      return deferred.promise;
    }

    function editAvailability(id, newEvent, revertFunc){
    	var p = RestService.editHeroAvailability(idHero, id, { dataInizio: newEvent.start.toDate().getTime(), dataFine: newEvent.end.toDate().getTime() });
    	p.then(function(data){
          var evBg = _.remove(self.events.bg.avail, function(ev) {
            return ev.id == id;
          });
          var evFg = _.remove(self.events.fg.avail, function(ev) {
            return ev.id == id;
          });

          var newEv = { id: id, dataInizio: newEvent.start.toDate().getTime(), dataFine: newEvent.end.toDate().getTime() };
          pushEventInModel(newEv, 'avail');
          CalendarScope.reRenderCalendars();
    	});
    }

    function addAvailability(start, end){
    	var p = RestService.createNewHeroAvailability(idHero, { dataInizio: start.getTime(), dataFine: end.getTime() });
    	p.then(function(data){
            var newId = data.data.plain().id;
            pushEventInModel({ id: newId, dataInizio: start.getTime(), dataFine: end.getTime() }, 'avail');
            CalendarScope.reRenderCalendars();
    	});
    }

    function deleteAvailability(id){
    	if(id === undefined || !_.isString(id))
        	return;

        var p = RestService.deleteHeroAvailability(idHero, id);
	    p.then(function(data){
	    	if(data.status == 400 || data.status == 404) {
  				NotifyService.modal(options.connectionError);
  				return;
        }
        var deletedFg = _.remove(self.events.fg.avail, function(ev) {
  			  return ev.id == id;
  			});
  			var deletedBg = _.remove(self.events.bg.avail, function(ev) {
  			  return ev.id == id;
  			});
        CalendarScope.reRenderCalendars();

	    });
    }

    function isDateInShownPeriod(date){
      var deferred = $q.defer();
    	if(minShown == null || maxShown == null)
    		return false;

    	var calcDate = moment(date);
    	if(calcDate.valueOf() >= minShown.valueOf() && calcDate.valueOf() < maxShown.valueOf())
    		return true;
    	else
    		return false;

      return deferred.promise;
    }

    function setPeriod(date) {
    	var startDate = moment(date);
    	var endDate = moment(date);
    	startDate.subtract(14, 'days');
    	endDate.add(21, 'days');
    	minShown = startDate;
    	maxShown = endDate;
    }

    function getDataFromServer(force, callback, instance){
      var deferred = $q.defer();
    	if(lastMin && filDate(minShown) == filDate(lastMin) && !force) {
    		callback();
    		return;
    	}

  		lastMin = _.clone(minShown);
  		lastMax = _.clone(maxShown);

  		var filters = {
  	        dataInizioMin: filDate(minShown), // ggmmaaaa
  	        dataInizioMax: filDate(maxShown)
  	    };

  		var avails = [];
  		var res = [];
      var req = [];

  		var p = RestService.getHeroAvailability(idHero, _.clone(filters));
  		p.then(function(data){

  			if(data.status == 400 || data.status == 404) {
  				NotifyService.modal(options.connectionError);
  				return;
        }
        avails = data.data.plain();
        return RestService.getHeroAppointments(idHero, _.clone(filters));

  		}).then(function(data){

  			if(data.status == 400 || data.status == 404) {
  				NotifyService.modal(options.connectionError);
  				return;
        }
        res = data.data.plain();
        return RestService.getHeroAppointRequests(idHero, _.clone(filters));

  		}).then(function(data){

        if(data.status == 400 || data.status == 404) {
  				NotifyService.modal(options.connectionError);
  				return;
        }
        req = data.data.plain();

        pushEventsInModel(req, 'req');
        pushEventsInModel(avails, 'avail');
        pushEventsInModel(res, 'res');

        if(instance !== null && instance !== undefined)
          instance.fullCalendar( 'refetchEvents' );
        setLoading(false);

        deferred.resolve(true);

      });
      return deferred.promise;

    }

    function pushEventsInModel(events, type){
    	if(events !== undefined){
    		self.events.fg[type].length = 0;
	    	self.events.bg[type].length = 0;

        var bgColor = options.bgColorAvailDefault;
    	if(type === "res")
    		bgColor = options.bgColorRes;

        var evBg = [];
        var evFg = [];

        events.forEach(function(ev){
          evFg.push(formatEvent(ev, type));
          evBg.push(formatEvent(ev, type, bgColor));
        });

    	  self.events.fg[type].push.apply(self.events.fg[type], evFg);
    		self.events.bg[type].push.apply(self.events.bg[type], evBg);

        CalendarScope.reRenderCalendars();
    	}
    }

    function pushEventInModel(event, type, onlyBg){
    	if(event !== undefined){
	    	var bgColor = options.bgColorAvailDefault;
	    	if(type === "res")
	    		bgColor = options.bgColorRes;

        if(onlyBg !== true)
    		  self.events.fg[type].push(formatEvent(event, type));

    		self.events.bg[type].push(formatEvent(event, type, bgColor));
    	}
    }

    function formatEvent(obj, type, bg){
    	var eventCal = {
        	id: obj.id,
            tipoServizioId: obj.tipoServizioId,
        	type: type,
        	start: new Date(obj.dataInizio),
        	end: new Date(obj.dataFine),
        	allDay: false,
          stato: obj.stato
    	};

      if(type === 'req'){
        obj = formatSideRequest(obj);
        eventCal.model = obj.model;
        eventCal.service = Services.NumberById(obj.tipoServizioId);
      }

      if(type === 'res'){
        eventCal.service = Services.NumberById(obj.tipoServizioId);
      }


    	if(bg !== undefined) {
    		eventCal.rendering = "background";
    		eventCal.backgroundColor = bg;
    	}

    	return eventCal;
    }

    function formatSideRequest(req){
      req.model = {
        day: moment(req.dataInizio).format('dddd D MMMM'),
        time: moment(req.dataInizio).format('HH:mm')+' - '+moment(req.dataFine).format('HH:mm'),
        where: req.via+', '+req.cap+' '+req.citta,
        timeRequested: moment(req.dataCreazione).format('HH:mm'),
        service: Services.NumberById(req.tipoServizioId),
        stato: req.stato
      };
      return req;
    }

    function formatSideAppointment(app){
      app.model = {
        day: moment(app.dataInizio).format('dddd D MMMM'),
        time: moment(app.dataInizio).format('HH:mm')+' - '+moment(app.dataFine).format('HH:mm'),
        //where: app.via+', '+app.cap+' '+app.citta,
        indirizzo: app.indirizzoPrestazione ? app.indirizzoPrestazione.via+' '+app.indirizzoPrestazione.numeroCivico+', '+app.indirizzoPrestazione.cap+' '+app.indirizzoPrestazione.citta : '',
        //indirizzo: 'Via Grandi 2, 20112 Milano',
        timeRequested: moment(app.dataCreazione).format('HH:mm'),
        service: Services.NumberById(app.tipoServizioId),
        stato: app.stato
      };
      return app;
    }

    function filDate(date){
    	return $filter('date')(date._d,'ddMMyyyy');
    }

    function setLoading(value){
        self.loading = value;
    }

}
