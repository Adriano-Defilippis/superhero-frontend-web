'use strict';

export default function HeroProfileController (
    $scope, HeroInfoService, NotifyService, HeroProfile
) {
    "ngInject";

  	var self = this;
    var heroInfo = HeroInfoService.getInfo();
    var lingue = [];
    heroInfo.lingue.forEach(function(lingua){
      lingue.push(lingua.descrizione);
    });

    var indirizzoObj = heroInfo.indirizzoResidenza;
    heroInfo.indirizzoCompleto = indirizzoObj.via + " " + indirizzoObj.numeroCivico + ", " + indirizzoObj.cap + " " + indirizzoObj.citta;

    heroInfo.competenzeData = HeroProfile.getHeroExperiences(heroInfo);
    console.log(heroInfo.competenzeData);

    var sottoCompetenze = [];
    heroInfo.sottoCompetenze.forEach(function(sottocompetenza){
        if (sottocompetenza.id !== 'ATT-00000000-0000-0000-0002-000000000006') {
            sottoCompetenze.push(sottocompetenza);
        }
    });

    self.getBoolLabel = function(bool){
      return bool ? "Si" : "No";
    }

    // decoro il model con gli array di lingue e competenze
    heroInfo.lingue = lingue;
    //heroInfo.competenze = competenze;
    heroInfo.sottoCompetenze = sottoCompetenze;
    //heroInfo.competenzeShow = competenzeShow;

    self.heroInfo = heroInfo;


    // Edit profile modal
    self.editProfile = function(){
      NotifyService.editProfile(heroInfo.id);
    }

  }
