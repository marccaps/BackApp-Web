function signup() {
    if ($("#password-input").val() == $("#password-repeat").val()) {
        var input = new Object();
        input["user"] = $("#user-input").val();
        input["password"] = $("#password-input").val();

        $.ajax({
            type: "POST",
            url: baseUrl + "api/signup",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(input),
            error: function () {
                return false;
            },
            success: function (result) {
                if (result.success == true) {
                    setSuccessful();
                    setTimeout(function() {
                        window.location.href = "login.html";
                    }, 5000);
                }
                else {
                    //Error
                    clearFields();
                    setError("Server error: ");
                    return false;
                }
                return true;
            }
        });
    }
    else {
        setError("Passwords don't match.");
        clearFields();
    }
}

function clearFields() {
    $("#target").trigger("reset");
}

function setError(message) {
    //Añadimos alert antes del table
    $(".alert").remove();
    var alert = new Object();
    alert["class"] = "alert alert-danger";
    alert["role"] = "alert";
    $("<div/>", alert).text(message).insertBefore("#target");
}

function setSuccessful() {
    //Añadimos alert antes del table
    $(".alert").remove();
    var alert = new Object();
    alert["class"] = "alert alert-success";
    alert["role"] = "alert";
    $("<div/>", alert).text("User registration successfully submitted.").insertBefore("#target");
}

$(document).ready(function(){
    $("#target .btn").click(signup);
});