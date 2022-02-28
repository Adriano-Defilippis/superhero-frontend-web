'use strict';

export default function ContactCenterReportReferralController (
    $scope, report, AssetsStore, FileSaver, Blob
) {
    "ngInject";

  	var file = new Blob([report.data], { type: 'text/csv' });

    FileSaver.saveAs(file, 'report_referral_vouchers.csv');

  }