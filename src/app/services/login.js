/*global $:false, angular:false, console:false, _:false, Cookies:false */
'use strict';

export default function LoginService (
    $rootScope, $filter, $location, $timeout, $q, $state, ngDialog, RestService, AssetsStore, Restangular
){
    "ngInject";

    var self = this;

    self.showLogin = function(userDetected, callb){
      ngDialog.open({
        template:
          '<div ng-if="!mv.showPasswordReset"><h3 class="center">Login</h3>'+
          (userDetected ? '<p class="center"><b>Un utente è già presente con i dati inseriti, connetti per proseguire con l\'ordine.</b></p>' : '')+
          '<p class="center">Inserisci le tue credenziali per connetterti</p><br></div>'+
          '<div ng-if="mv.showPasswordReset"><h3 class="center">Reset Password</h3>'+
          '<p class="center">Inserisci la tua email</p><br></div>'+
          '<form name="login" ng-submit="logIn(login.$valid)" ng-if="!mv.showPasswordReset && !mv.passwordResetRequested">'+
            '<div input-field>'+
              '<input type="email" name="email" required minlength="3" ng-model="mv.user">'+
              '<label>Email</label>'+
            '</div>'+
            '<div input-field>'+
              '<input type="password" name="password" required minlength="3" ng-model="mv.password">'+
              '<label>Password</label>'+
            '</div>'+
            '<p class="center"><button class="btn waves-effect waves-light main-orange" type="submit" name="action">Login</button></p>'+
            '<p class="center error"><i ng-bind="mv.response"></i></p>'+
          '</form>'+
          '<div ng-if="mv.showPasswordReset && !mv.passwordResetRequested">'+
            '<div input-field>'+
              '<input type="email" name="emailToReset" required minlength="3" ng-model="mv.emailToReset">'+
              '<label>Email</label>'+
            '</div>'+
            '<p class="center"><button class="btn waves-effect waves-light main-orange" type="submit" name="resetPassword" ng-click="resetPassword()">Reset Password</button></p>'+
            '<p class="center error"><i ng-bind="mv.response"></i></p>'+
          '</div>'+
          '<p class="center" ng-if="!mv.showPasswordReset && !mv.passwordResetRequested"><br><i ng-click="forgotPassword()">Dimenticato la password?</i></p>'+
          '<div ng-if="mv.passwordResetRequested">'+
            '<p>Abbiamo inviato una mail al tuo indirizzo contente un link per completare la procedura di reset della password.</p>'+
          '</div>',
        className: 'ngdialog-theme-default ngdialog-login',
        showClose: true,
        plain: true,
        controller: function($scope, $state, $timeout){
          "ngInject";
          $scope.mv = { user: '', password: '', response: '', emailToReset: '', showPasswordReset: false, passwordResetRequested: false};

          $scope.logIn = function(valid){
            if(valid){

              var logInP = logUserIn($scope.mv.user, $scope.mv.password);
              logInP.then(function(){

                $location.search('azione', null);
                $timeout(function(){
                    if(_.isFunction(callb)) {
                        getLoginCookies(false, callb);
                    } else {
                        getLoginCookies(true);
                    }
                });
              }, function(error){

                $timeout(function(){
                  $scope.mv.response = error;
                });

              });
            }
          }

          $scope.forgotPassword = function(){
            $scope.mv.showPasswordReset = true;
          }

          $scope.resetPassword = function(){
            if($scope.mv.emailToReset){
              var request = RestService.requestResetPassword($scope.mv.emailToReset);
              request.then(function(data){
                $scope.mv.passwordResetRequested = true;
              }, function(){
                $timeout(function(){
                  $scope.mv.response = 'La mail risulta non valida, ricontrolla';
                });
              });
            } else {
              $timeout(function(){
                $scope.mv.response = 'Inserisci una mail valida per resettare la password';
              });
            }
          }

        }
      });
    }

    self.logAfterActivation = function(user, pass){
      var deferred = $q.defer();

      var logInP = logUserIn(user, pass);
      logInP.then(function(){

        $timeout(function(){
          getLoginCookies();
          deferred.resolve();
        });

      }, function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function logUserIn(user, pass){
      var deferred = $q.defer();

      var loginInfo = {
        username: _.clone(user),
        password: _.clone(pass)
      }
      var p = RestService.login(loginInfo);
      p.then(function(data){

          var token = data.data.plain().token;
          var refreshToken = data.data.plain().refreshToken;
          var userRole = data.data.plain().ruolo;
          var userId = data.data.plain().userid;
          var userCompany = data.data.plain().societa;

          var rolesMap = {
            recruiter: 'Hsn5dhImmfsl',
            backoffice: 'nTvjhbdlkjn6',
            cliente: 'li89mMufaha2',
            superhero: 'Mofnwe54hUkl',
            guest: 'Omflsdfkj6as',
            admin: 'OIjknsdf6asm'
          };

          Cookies.expire('username');
          Cookies.expire('user-id');
          Cookies.expire('auth-token');
          Cookies.expire('user-role');
          Cookies.expire('user-company');
          Cookies.expire('refresh-token');

          Cookies.set('username', user, { expires: (60 * 60 * 8) });
          Cookies.set('user-id', userId, { expires: (60 * 60 * 8) });
          Cookies.set('auth-token', token, { expires: (60 * 60 * 8) });
          Cookies.set('refresh-token', refreshToken, { expires: (60 * 60 * 8) });
          Cookies.set('user-company', userCompany, { expires: (60 * 60 * 8) });
          Cookies.set('user-role', rolesMap[userRole], { expires: (60 * 60 * 8) });

          deferred.resolve();

      }, function(){
        deferred.reject('Email o Password errata.');
      });

      return deferred.promise;
    }

    function getLoginCookies(refresh, callb){
      var authToken = Cookies.get('auth-token');
      if(authToken) {
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

        if(role) {
          $rootScope.userRole = rolesMap[role];
        } else {
          $rootScope.userRole = 'guest';
        }

        if(userId) {
          $rootScope.userId = userId;
        }
      } else {
        $rootScope.logged = false;
      }

      if(authToken) {
        Restangular.setDefaultHeaders({'X-Auth-Token': authToken});
      }

      if(refresh){
        $timeout(function(){
          if($rootScope.userRole == 'superhero'){
            RestService.getHero($rootScope.userId).then(function(response) {
              if (response.data.mostraCondizioniServizio && response.data.mostraCondizioniServizio == true) {
                $state.transitionTo('main.contract', {}, {
                  reload: true, inherit: false, notify: true
                });
              }
              else {
                $state.transitionTo('main.hero.index', {}, {
                  reload: true, inherit: false, notify: true
                });
              }
            });

        } else if ($rootScope.userRole == 'backoffice') {
            $state.transitionTo('main.support.clienti', {}, {
              reload: true, inherit: false, notify: true
            });
        } else if ($rootScope.userRole == 'recruiter') {
            $state.transitionTo('main.recruiter.applications', {}, {
              reload: true, inherit: false, notify: true
            });
        } else {
            $state.reload('main');
          }
        }, 1000);
    } else if (_.isFunction(callb)) {
        callb();
    }
      //$state.go($state.current, {}, {reload: true});
    }

}
