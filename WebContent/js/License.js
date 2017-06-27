$(document).ready(function () {
    $("#licenseDeclinePage").hide();
    $("#btnDecline").click(ShowLicenseDeclineInfo);
})

function ShowLicenseDeclineInfo() {
    $("#licenseDeclinePage").show();
    $("#licenseDisclaimerPage").hide();
}