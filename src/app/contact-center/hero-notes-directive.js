'use strict';

export default function CCHeroNotesDirective (
        $log,
        $stateParams,
        $timeout,
        RestService
    ){
        "ngInject";

        $log.debug('[HERO_NOTES] Directive initialized');

        return {
          restrict: 'EA',
          scope: {
            note: '@',
            label: '@',
            noteType: '@'
          },
          templateUrl: 'app/contact-center/hero-notes-directive.html',
          controllerAs: 'notesCtrl',
          link: linkFunction
        }

        function linkFunction (scope, elem, attrs, ctrl)
        {
            var timeoutOutput;

            scope.nuoveNote = _.clone(scope.note);

            scope.saveNotes = function ()
            {
                $log.debug('[HERO_NOTES] Saving notes...', scope.nuoveNote, scope.note);
                if (scope.nuoveNote) {
                    RestService.CCSaveHeroNotes($stateParams.id, scope.nuoveNote, scope.noteType).then(function(){
                        $log.debug('[HERO_NOTES] Notes saved');
                        scope.setOutput('Note salvate!');
                    }, function() {
                        $log.error('[HERO_NOTES] Error while saving notes');
                        scope.setOutput('Errore nel salvataggio!');
                    });
                }
            }

            scope.setOutput = function (output)
            {
                scope.output = output;
                timeoutOutput = $timeout(function () {
                    scope.output = '';
                }, 3000);
            }

            scope.$on("$destroy", function() {
                $timeout.cancel( timeoutOutput );
            });
        }

    }
