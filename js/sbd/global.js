function readCookie(key) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}

function setUser() {
    var user = readCookie("username");
    $("#user-name").text(" " + user);
}

function testCookies() {
    var user = readCookie("username");
    var password = readCookie("password");
    if (password == null || user == null) window.location.href = "login.html";
}

function logout() {
    //Borrem cookies
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "login.html";
}

//Globals
var baseUrl = "http://192.168.5.241:5000/"