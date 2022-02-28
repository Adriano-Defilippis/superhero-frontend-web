'use strict';

export default function UserHeroProfileController (
    $scope, heroProfileInfo, HeroProfile
) {
    "ngInject";

  	var self = this;

    self.hero = HeroProfile.getFormattedData(heroProfileInfo.data.plain());
}
