function getFilesAPI() {
    var username = readCookie("username");
    var password = readCookie("password")
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/api/" + username + "/files",
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
        },
        error: function () {
            return false;
        },
        success: function (result) {
            if (result.success == true) {

            }
            else {
                //Error
                clearFields();
                setError();
                return false;
            }
            return true;
        }
    });
}

$(document).ready(function() {
    testCookies();
    setUser();

    $("#logout").click(function() {
        logout();
    })    
});
