function authenticate() {
    var input = new Object();
    input["user"] = $("#user-input").val();
    input["password"] = $("#password-input").val();

    $.ajax({
    type: "POST",
    url: "http://127.0.0.1/api/signin",
    cache: false,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(input),
    error: function () {
        return false;
    },
    success: function (result) {
        if (result.success == true) {
            
        }
        else {
            //Error
            return false;
        }
        return true;
    }
});
}

$(document).ready(function(){
    $("#target").submit(authenticate);
});