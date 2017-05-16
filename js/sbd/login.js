function authenticate() {
    var input = new Object();
    input["user"] = $("#user-input").val();
    input["password"] = $("#password-input").val();

    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/api/signin",
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(input),
        error: function () {
            return false;
        },
        success: function (result) {
            if (result.success == true) {
                document.cookie = "username=" + input["user"] + "; ";
                document.cookie = "password=" + input["password"] + "; ";
                window.location.href = "index.html";
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

function clearFields() {
    $("#target").trigger("reset");
}

function setError() {
    //Añadimos alert antes del table
    var alert = new Object();
    alert["class"] = "alert alert-danger";
    alert["role"] = "alert";
    $("<div/>", alert).text("Username or password incorrect.").insertBefore("#target");
}

$(document).ready(function(){
    $("#target .btn").click(authenticate);
});