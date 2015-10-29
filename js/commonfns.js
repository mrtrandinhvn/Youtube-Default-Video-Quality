// Used for PayrollManager pages
var doLoginPayrollManager = function (userObj) {
    var username = userObj.username;
    var password = userObj.password;
    var actualCode = ["$('#un').val('" + username + "');",
                  " $('#pwd').val('" + password + "');",
                  " doAuthenticate();"
    ].join('\n');
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}
// Select User Role
var doLoginWithRole = function () {
    var observer = new MutationObserver(function (mutations) {
        var roleList = $('select option');
        var isTriggered = false;
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].attributeName == "style") {
                isTriggered = true;
            }
        }
        if (isTriggered) {
            if (roleList.length > 2) {
                for (var i = 0; i < roleList.length; i++) {
                    if ($(roleList[i]).text() == "Manager") {
                        $(roleList[i]).prop('selected', true);
                        var script = document.createElement('script');
                        script.textContent = "$('select').change();";
                        (document.head || document.documentElement).appendChild(script);
                        script.parentNode.removeChild(script);
                        break;
                    }
                }
            }
        }
    });
    var roleSelectNode = $('.brID-RoleType')[0];
    observer.observe(roleSelectNode, { attributes: true });

}
// Specific action to do login in normal honey pages
var doLoginActions = function (userObj) {
    $('.brID-Username input').val(userObj.username);
    $('.brID-Username input').focus();
    $('.brID-Password input').val(userObj.password);
    $('.brID-Password input').focus();
    $('.btn_login .brID-actionButton.br-button input').focus();
    $('.btn_login .brID-actionButton.br-button input').click();
    doLoginWithRole();
}

// Used for all normal honey pages
var doNormalLogin = function (userObj) {
    if (!document.hasFocus()) {
        // can't get focus priority from console so I have to set this event.
        $(window).focus(function () {
            doLoginActions(userObj);
        });
    } else {
        doLoginActions(userObj);
    }
}
var setSpecialLoginData = function (username, password) {
    var userObj = {
        username: username,
        password: password
    };
    return userObj;
}