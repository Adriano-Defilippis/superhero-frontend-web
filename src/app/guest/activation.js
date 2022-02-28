'use strict';

export default function GuestActivationController (
    $scope, $rootScope, $state, $stateParams, $timeout, RestService, LoginService
){
    "ngInject";

    var self = this;

    self.mv = {
      password: '',
      passwordConfirm: ''
    }

    self.pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,12}$/;

    self.output = '';

    self.submitPassword = function(valid){
      var confirmed = checkPassword();
      if(!valid) {
        $timeout(function(){
          self.output = "La password non rispetta le specifiche.";
        });
      } else if(!confirmed){
        $timeout(function(){
          self.output = "Le password non coincidono!";
        });
      } else {
        var data = {
          token: $stateParams.token,
          userId: $stateParams.userId,
          newPassword: self.mv.password
        }
        var p = RestService.newPassword(data);
        p.then(function(data){
          if(data.status === 200 || data.status === 201){

            var logInP = LoginService.logAfterActivation($stateParams.email, self.mv.password);
            logInP.then(function(){
              $timeout(function(){
                var userRole = $rootScope.userRole;
                if(userRole && userRole == 'cliente')
                  $state.go('main.user.index');
                else if(userRole && userRole == 'superhero')
                  $state.go('main.hero.index');
                else
                  $state.go('main.guest.welcome');
              }, 300);
            }, function(error){
              $timeout(function(){
                self.output = error;
              });
            });

          }
        }, function(data){
          $timeout(function(){
            self.output = "Il token non è valido, potrebbe essere scaduto o già utilizzato. Se non ricordi la password prova a resettarla.";
          });
        });
      }
    }

    var activationData = $stateParams;
    if(activationData.userId !== undefined && activationData.token !== undefined){

    }

    function checkPassword(){
      if(self.mv.password === undefined || self.mv.passwordConfirm === undefined || self.mv.password === '' || self.mv.passwordConfirm === '') {
        return false;
      }

      if(self.mv.password === self.mv.passwordConfirm) {
        return true;
      } else {
        $timeout(function(){
          self.output = "Le password non coincidono!";
        });
        return false;
      }
    }
  }
