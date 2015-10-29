$(document).ready(function () {
    var currentURL = document.URL;
    var currentDomain = document.domain;
    var payrollManagerPattern = /\/app\/pub\/cli\/logon.html/;
    var normalPattern = /.honeysoftware.co.nz\/login.aspx|localhost:63653\/login.aspx|careers.crewships.com\/login.aspx/;
    var userObj;// use to store login account
    if (payrollManagerPattern.test(currentURL)) {
        userObj = {
            username: "admin",
            password: "clover"
        }
        switch (true) {
            case /asptest-adminnoncrm/.test(currentURL):
                userObj = setSpecialLoginData("admin", "clover");
                break;
            case /hiltontest-adminnoncrm/.test(currentURL):
                userObj = setSpecialLoginData("admin", "hiltonadmin");
                break;
            case /fleetwoodtest-adminnoncrm/.test(currentURL):
                userObj = setSpecialLoginData("admin", "fleetwoodadmin");
                break;
            case /awftest-apps.honeysoftware.co.nz/.test(currentURL):
                userObj = setSpecialLoginData("penrose", "penr0se");
                break;
            case /aupayroll-admin.honeysoftware.co.nz/.test(currentURL):
                userObj = setSpecialLoginData("admin", "aupayrolladmin");
                break;
            case /localhost:/.test(currentURL):
                // use default userObj
                break;
            default:
                // ie "jettstest-admin.honeysoftware.co.nz" -> password = "jettsadmin"
                userObj = setSpecialLoginData("admin", currentDomain.split("-")[0].replace("test", "admin"));
                break;
        }
        doLoginPayrollManager(userObj);
    } else if (normalPattern.test(currentURL)) {
        userObj = {
            username: "admin",
            password: "12345"
        }
        switch (true) {
            case /drakehp.honeysoftware.co.nz/.test(currentURL):
            case /nzruuat.honeysoftware.co.nz/.test(currentURL):
            case /draketest.honeysoftware.co.nz/.test(currentURL):
                userObj = setSpecialLoginData("admin", "aaa");
                break;
            case /hiltontest-adminnoncrm/.test(currentURL):
            case /careers.crewships.com\/login.aspx/.test(currentURL):
            case /aspcrewtest.honeysoftware.co.nz/.test(currentURL):
                userObj = setSpecialLoginData("phil", "123");
                break;
        }
        doNormalLogin(userObj);
    }
});
