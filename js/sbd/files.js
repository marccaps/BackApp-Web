function getFilesAPI() {
    var username = readCookie("username");
    var password = readCookie("password");
    $.ajax({
        type: "GET",
        url: baseUrl + "api/" + username + "/files",
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
        },
        error: function () {
            return false;
        },
        success: function (result) {
            /*if (result.success == true) {
                setFilesPage();
            }
            else {
                //Error
                return false;
            }*/
            setFilesPage(JSON.parse(result));
            return true;
        }
    });
}

function setFilesPage(result) {
    for (var key in result[1]["children"]) {
        if (result[1]["children"].hasOwnProperty(key)) {
            var div = {};
            div["class"] = "col-lg-4 col-md-4 col-xs-6 thumb";
            var a = {};
            a["class"] = "thumbnail";
            a["href"] = "#";
            a["data-url"] = baseUrl + "api/" + readCookie("username") + "/" + key + "/tokenizer";
            a["data-filename"] = key;
            var img = {};
            img["class"] = "img-responsive";
            img["width"] = 150;
            img["height"] = 150;
            img["src"]="PDF.png";

            $("#div-files").append(
                $('<div/>', div).append(
                    $('<a/>', a).append(
                        $('<img/>', img).append(),
                        $('<h1/>').text(key).append())
                )
            );

        }
    }
    $("a[data-url]").click(function(){
        getDownloadToken($(this).data("filename"), $(this).data("url"));
    });
}

function uploadUrlApi() {
    var username = readCookie("username");
    var password = readCookie("password");

    $.ajax({
        // Your server script to process the upload
        url: baseUrl + "api/" + username + "/upload_file",
        type: 'POST',

        // Form data
        data: new FormData($('upload-form :file')),

        // Tell jQuery not to process data or worry about content-type
        // You *must* include these options!
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
        },

        // Custom XMLHttpRequest
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        $('#upload-modal progress').attr({
                            value: e.loaded,
                            max: e.total,
                        });
                    }
                } , false);
            }
            return myXhr;
        },
        success: function (result) {
            alert("blabla");
        }
    });
}

function downloadFileToken(filename, token) {
    var username = readCookie("username");
    window.location = baseUrl + "api/download/token/" + token;
}

function getDownloadToken(filename, url) {
    var username = readCookie("username");
    var password = readCookie("password");
    $.ajax({
        type: "GET",
        url: url,
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
                downloadFileToken(filename, result.token);
            }
            else {
                //Error
                setError("Error downloading file: " + filename);
            }
            return false;
        }
    });
}

function setError(message) {
    //Añadimos alert antes del table
    $(".alert").remove();
    var alert = new Object();
    alert["class"] = "alert alert-danger";
    alert["role"] = "alert";
    $("#div-notifications").append($("<div/>", alert).text(message));
}

$(document).ready(function() {
    testCookies();
    setUser();
    getFilesAPI();

    $("#logout").click(function() {
        logout();
    })
    $("#upload-button").click(function(){
        uploadUrlApi();
    });
});
