'use strict';

export default function HeroProfileController (
    heroProfileInfo, feedbacks, HeroProfile
){
    "ngInject";

    var self = this;
    self.info = HeroProfile.patchLegacyData(heroProfileInfo.data.plain());
    self.feedbacks = feedbacks.data.plain();
    self.startNewBooking = HeroProfile.startNewBooking;
    self.startCarnetBooking = HeroProfile.startCarnetBooking;

}
