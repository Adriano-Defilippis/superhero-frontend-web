'use strict';

export function AppRun (
    $rootScope, $location, $window, $state, $stateParams, ngDialog, Restangular, $timeout, CookiePolicy, locker, LocalStorageAlert
) {
    "ngInject";

    moment.locale('it');

    var parent = $rootScope;
    var child = parent.$new();

    // Runs coockie policy banner

    // Check if local/session starage is supported
    if (! locker.supported()) {
      LocalStorageAlert.show(child);
    }

    // filter helpers
    $rootScope.not = function(func) {
        return function (item) {
            return !func(item);
        }
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $timeout(function(){
        if(toState.name !== fromState.name || !_.includes(toState.name, 'main.user'))
          ngDialog.closeAll(); // closes any open dialog
      }, 100);

      // remove chat in non-guest pages
      if (!Modernizr.touch) {
          if (!_.includes(toState.name, 'main.guest')) {
              removeSmartsupp();
          } else {
              restartSmartsupp();
          }
      }


       // page title && page image preview
      $timeout(function() {
        $rootScope.pageTitle = (toState.data && toState.data.pageTitle) ? toState.data.pageTitle + ' - ilmioSupereroe.it'  : 'ilmioSupereroe.it';
        $rootScope.pageImagePreview = (toState.data && toState.data.imagePreview) ? toState.data.imagePreview : '';
      });

      // Google analytics pagreview
      if ($window.ga) $window.ga('send', 'pageview', { page: $location.path() });

      // Facebook pixel code pageview
      if ($window.fbq) $window.fbq('track', "PageView");

      // google remarketing code
      var acceptedCookiePolicy = getAccepted();
      if(acceptedCookiePolicy && !_.includes(fromState.name, 'main.user') && !_.includes(toState.name, 'main.hero') && !_.includes(toState.name, 'main.support') && !_.includes(toState.name, 'main.recruiter')) {
        $window.google_trackConversion({
          google_conversion_id: 944299938,
          google_custom_params: $window.google_tag_params,
          google_remarketing_only: true
        });
      }


    });

    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
      if(response.status === 403) {
        if (response.data && response.data.messaggio && response.data.messaggio === "Token scaduto") {
          if ($rootScope.user && typeof $rootScope.user !== 'undefined' && $rootScope.user !== "" && Cookies.get('refresh-token') && typeof Cookies.get('refresh-token') !== 'undefined' && Cookies.get('refresh-token') !== "") {
            Restangular.all('credenziali').get('refreshToken', {'username': $rootScope.user}, {'X-Auth-Token': Cookies.get('refresh-token')}).then((response) => {
              if (response.status === 201 || response.status === 200) {
                Cookies.set('auth-token', response.data.token, { expires: (60 * 60 * 8) });
                Cookies.set('refresh-token', response.data.refreshToken, { expires: (60 * 60 * 8) });
                Restangular.setDefaultHeaders({'X-Auth-Token': Cookies.get('auth-token')});
                $window.location.reload();
                return false;
              }
              else {
                $state.go('logout', {}, {reload: true});
                return false; // error handled
              }
            });
          }
          else {
            $state.go('logout', {}, {reload: true});
            return false; // error handled
          }
        }
        else {
          $state.go('logout', {}, {reload: true});
          return false; // error handled
        }
      }
      else if (response.status === 404 && response.data.messaggio.indexOf('refreshToken non associato') > -1) {
        $state.go('logout', {}, {reload: true});
        return false; // error handled
      }
      return true; // error not handled
    });

    var authToken = Cookies.get('auth-token');
    if(authToken !== null && typeof authToken !== 'undefined' && authToken !== "") {
      $rootScope.logged = true; // logged

      var username = Cookies.get('username');
      $rootScope.user = username; // username/mail

      var role = Cookies.get('user-role');
      var userId = Cookies.get('user-id');
      var rolesMap = {
        Hsn5dhImmfsl: 'recruiter',
        nTvjhbdlkjn6: 'backoffice',
        li89mMufaha2: 'cliente',
        Mofnwe54hUkl: 'superhero',
        Omflsdfkj6as: 'guest',
        OIjknsdf6asm: 'admin'
      };

      if(role !== null && typeof role !== 'undefined' && role !== "") {
        $rootScope.userRole = rolesMap[role];
      } else {
        $rootScope.userRole = 'guest';
      }

      if(userId !== null && typeof userId !== 'undefined' && userId !== "") {
        $rootScope.userId = userId;
      }

      // set smartsupp variables if logged
      // basic info
      if (typeof smartsupp !== 'undefined' && _.isFunction(smartsupp)) {
          if(userId != null && userId != 'null') smartsupp('name', userId);
          else smartsupp('name', username);
      }
      $rootScope.company = Cookies.get('user-company');

    } else {
      $rootScope.logged = false;
    }

    function getAccepted(){
      var acc = Cookies.get('cookie-policy');
      if(acc == 'true') return true;
      else return false;
    }

    function removeSmartsupp ()
    {
        if (typeof smartsupp !== 'undefined') {
            smartsupp('chat:end');
            var elem = angular.element('#chat-application-iframe');
            elem.remove();
        }
    }

    function restartSmartsupp ()
    {
        var elem = angular.element('#chat-application-iframe');
        if(elem.length < 1 && typeof smartsupp !== 'undefined' && _.isFunction(smartsupp.create)) {
            var a = smartsupp.create("chat", $window._smartsupp || $window._chatcfg);
            smartsupp.setupApi(a);
            a.render();
        }

    }
}
