/*
*  AngularJs Fullcalendar Wrapper for the JQuery FullCalendar
*  API @ http://arshaw.com/fullcalendar/
*
*  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches it deeply changes.
*       Can also take in multiple event urls as a source object(s) and feed the events per view.
*       The calendar will watch any eventSource array and update itself when a change is made.
*
*/

angular.module('ui.calendar', [])
  .constant('uiCalendarConfig', {calendars: {}})
  .controller('uiCalendarCtrl', ['$scope',
                                 '$timeout',
                                 '$locale', function(
                                  $scope,
                                  $timeout,
                                  $locale){

      var sources = $scope.eventSources,
          extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop,

          wrapFunctionWithScopeApply = function(functionToWrap){
              var wrapper;

              if (functionToWrap){
                  wrapper = function(){
                      // This happens outside of angular context so we need to wrap it in a timeout which has an implied apply.
                      // In this way the function will be safely executed on the next digest.

                      var args = arguments;
                      var _this = this;
                      $timeout(function(){
                        functionToWrap.apply(_this, args);
                      });
                  };
              }

              return wrapper;
          };

      var eventSerialId = 1;
      // @return {String} fingerprint of the event object and its properties
      this.eventsFingerprint = function(e) {
        if (!e._id) {
          e._id = e.id ? e.id : ('ui-calendar' + ( eventSerialId++ ));
        }

        return "" + e._id + (e.id || '') + (e.title || '') + (e.url || '') + (e.start?(e.start._i||e.start): '') + (e.end?(e.end._i||e.end) : '') +
          (e.allDay || '') + (e.className || '') + extraEventSignature(e) || '';
      };

      var sourceSerialId = 1, sourceEventsSerialId = 1;
      // @return {String} fingerprint of the source object and its events array
      this.sourceFingerprint = function(source) {
          var fp = '' + (source.__id || (source.__id = sourceSerialId++)),
              events = angular.isObject(source) && source.events;
          if (events) {
              fp = fp + '-' + (events.__id || (events.__id = sourceEventsSerialId++));
          }
          return fp;
      };

      // @return {Array} all events from all sources
      this.allEvents = function() {
        // do sources.map(&:events).flatten(), but we don't have flatten
        var arraySources = [];
        for (var i = 0, srcLen = sources.length; i < srcLen; i++) {
          var source = sources[i];
          if (angular.isArray(source)) {
            // event source as array
            arraySources.push(source);
          } else if(angular.isObject(source) && angular.isArray(source.events)){
            // event source as object, ie extended form
            var extEvent = {};
            for(var key in source){
              if(key !== '_id' && key !== 'events'){
                 extEvent[key] = source[key];
              }
            }
            for(var eI = 0;eI < source.events.length;eI++){
              angular.extend(source.events[eI],extEvent);
            }
            arraySources.push(source.events);
          }
        }
        return Array.prototype.concat.apply([], arraySources);
      };

      // Track changes in array of objects by assigning id tokens to each element and watching the scope for changes in the tokens
      // @param {Array|Function} arraySource array of objects to watch
      // @param tokenFn {Function} that returns the token for a given object
      // @return {Object}
      //  subscribe: function(scope, function(newTokens, oldTokens))
      //    called when source has changed. return false to prevent individual callbacks from firing
      //  onAdded/Removed/Changed:
      //    when set to a callback, called each item where a respective change is detected
      this.changeWatcher = function(arraySource, tokenFn) {
        var self;
        var getTokens = function() {
          var array = angular.isFunction(arraySource) ? arraySource() : arraySource;
          var result = [], token, el;
          for (var i = 0, n = array.length; i < n; i++) {
            el = array[i];
            token = tokenFn(el);
            map[token] = el;
            result.push(token);
          }
          return result;
        };

        // @param {Array} a
        // @param {Array} b
        // @return {Array} elements in that are in a but not in b
        // @example
        //  subtractAsSets([6, 100, 4, 5], [4, 5, 7]) // [6, 100]
        var subtractAsSets = function(a, b) {
          var result = [], inB = {}, i, n;
          for (i = 0, n = b.length; i < n; i++) {
            inB[b[i]] = true;
          }
          for (i = 0, n = a.length; i < n; i++) {
            if (!inB[a[i]]) {
              result.push(a[i]);
            }
          }
          return result;
        };

        // Map objects to tokens and vice-versa
        var map = {};

        // Compare newTokens to oldTokens and call onAdded, onRemoved, and onChanged handlers for each affected event respectively.
        var applyChanges = function(newTokens, oldTokens) {
          var i, n, el, token;
          var replacedTokens = {};
          var removedTokens = subtractAsSets(oldTokens, newTokens);
          for (i = 0, n = removedTokens.length; i < n; i++) {
            var removedToken = removedTokens[i];
            el = map[removedToken];
            delete map[removedToken];
            var newToken = tokenFn(el);
            // if the element wasn't removed but simply got a new token, its old token will be different from the current one
            if (newToken === removedToken) {
              self.onRemoved(el);
            } else {
              replacedTokens[newToken] = removedToken;
              self.onChanged(el);
            }
          }

          var addedTokens = subtractAsSets(newTokens, oldTokens);
          for (i = 0, n = addedTokens.length; i < n; i++) {
            token = addedTokens[i];
            el = map[token];
            if (!replacedTokens[token]) {
              self.onAdded(el);
            }
          }
        };
        return self = {
          subscribe: function(scope, onArrayChanged) {
            scope.$watch(getTokens, function(newTokens, oldTokens) {
              var notify = !(onArrayChanged && onArrayChanged(newTokens, oldTokens) === false);
              if (notify) {
                applyChanges(newTokens, oldTokens);
              }
            }, true);
          },
          onAdded: angular.noop,
          onChanged: angular.noop,
          onRemoved: angular.noop
        };
      };

      this.getFullCalendarConfig = function(calendarSettings, uiCalendarConfig){
          var config = {};

          angular.extend(config, uiCalendarConfig);
          angular.extend(config, calendarSettings);

          angular.forEach(config, function(value,key){
            if (typeof value === 'function'){
              if(key !== "eventRender" && key !== "eventAfterRender" && key !== 'eventOverlap' && key !== 'selectOverlap')
              config[key] = wrapFunctionWithScopeApply(config[key]);
            }
          });

          return config;
      };

    this.getLocaleConfig = function(fullCalendarConfig) {
      if (!fullCalendarConfig.lang || fullCalendarConfig.useNgLocale) {
        // Configure to use locale names by default
        var tValues = function(data) {
          // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
          var r, k;
          r = [];
          for (k in data) {
            r[k] = data[k];
          }
          return r;
        };
        var dtf = $locale.DATETIME_FORMATS;
        return {
          monthNames: tValues(dtf.MONTH),
          monthNamesShort: tValues(dtf.SHORTMONTH),
          dayNames: tValues(dtf.DAY),
          dayNamesShort: tValues(dtf.SHORTDAY)
        };
      }
      return {};
    };
  }])
  .directive('uiCalendar', ['uiCalendarConfig', function(uiCalendarConfig) {
    return {
      restrict: 'A',
      scope: {eventSources:'=ngModel',calendarWatchEvent: '&'},
      controller: 'uiCalendarCtrl',
      link: function(scope, elm, attrs, controller) {

        var sources = scope.eventSources,
            sourcesChanged = false,
            calendar,
            eventSourcesWatcher = controller.changeWatcher(sources, controller.sourceFingerprint),
            eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventsFingerprint),
            options = null;

        function getOptions(){
          var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {},
              fullCalendarConfig;

          fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);

          var localeFullCalendarConfig = controller.getLocaleConfig(fullCalendarConfig);
          angular.extend(localeFullCalendarConfig, fullCalendarConfig);
          options = { eventSources: sources };
          angular.extend(options, localeFullCalendarConfig);
          //remove calendars from options
          options.calendars = null;

          var options2 = {};
          for(var o in options){
            if(o !== 'eventSources'){
              options2[o] = options[o];
            }
          }
          return JSON.stringify(options2);
        }

        scope.destroy = function(){
          if(calendar && calendar.fullCalendar){
            calendar.fullCalendar('destroy');
          }
          if(attrs.calendar) {
            calendar = uiCalendarConfig.calendars[attrs.calendar] = $(elm).html('');
          } else {
            calendar = $(elm).html('');
          }
        };

        scope.init = function(){
          calendar.fullCalendar(options);
          if(attrs.calendar) {
            uiCalendarConfig.calendars[attrs.calendar] = calendar;
          }
        };

        eventSourcesWatcher.onAdded = function(source) {
          calendar.fullCalendar('addEventSource', source);
          sourcesChanged = true;
        };

        eventSourcesWatcher.onRemoved = function(source) {
          calendar.fullCalendar('removeEventSource', source);
          sourcesChanged = true;
        };

        eventSourcesWatcher.onChanged = function(source) {
          calendar.fullCalendar('refetchEvents');
          sourcesChanged = true;
        };

        eventsWatcher.onAdded = function(event) {
          calendar.fullCalendar('renderEvent', event, true);
        };

        eventsWatcher.onRemoved = function(event) {
          calendar.fullCalendar('removeEvents', event._id);
        };

        eventsWatcher.onChanged = function(event) {
          event._start = jQuery.fullCalendar.moment(event.start);
          event._end = jQuery.fullCalendar.moment(event.end);
          calendar.fullCalendar('updateEvent', event);
        };

        eventSourcesWatcher.subscribe(scope);
        eventsWatcher.subscribe(scope, function() {
          if (sourcesChanged === true) {
            sourcesChanged = false;
            // return false to prevent onAdded/Removed/Changed handlers from firing in this case
            return false;
          }
        });

        scope.$watch(getOptions, function(newO,oldO){
            scope.destroy();
            scope.init();
        });
      }
    };
}]);
