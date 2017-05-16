$(document).ready(function() {
    testCookies();
    setUser();

    $("#logout").click(function() {
        logout();
    })
});