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
            a["data-url"] = baseUrl + "api/" + readCookie("username") + "/" + key;
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
        downloadUrlApi($(this).data("filename"), $(this).data("url"));
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
        data: new FormData($('upload-form')[0]),

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
    });
}

function downloadUrlApi(filename, url) {
    var username = readCookie("username");
    var password = readCookie("password");
    var header = "Basic " + btoa(username + ":" + password);
    document.cookie = "Authorization=" + header;

    /*$.fileDownload(url, {
        httpMethod: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
        },
        successCallback: function(url) {
            //Success
        },
        failCallback: function (html, url) {
            //Fail
            setError("Error downloading url: " + url);
        }
    });*/

    var req = ic.ajax.raw({
        type: 'GET',
        url: url,
        beforeSend: function (request) {
            request.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            request.setRequestHeader('Access-Control-Allow-Headers', '*');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
        },
        processData: false
    });

    var maxSizeForBase64 = 1048576; //1024 * 1024

    req.then(
        function resolve(result) {
            var str = result.response;

            var anchor = $('#hidden-anchor');
            var windowUrl = window.URL || window.webkitURL;
            if (str.length > maxSizeForBase64 && typeof windowUrl.createObjectURL === 'function') {
                var blob = new Blob([result.response], { type: "application/octet-stream" });
                var url = windowUrl.createObjectURL(blob);
                anchor.prop('href', url);
                anchor.prop('download', filename);
                anchor.get(0).click();
                windowUrl.revokeObjectURL(url);
            }
            else {
                //use base64 encoding when less than set limit or file API is not available
                anchor.attr({
                    href: 'data:text/plain;base64,'+ b64EncodeUnicode(result.response),
                    download: filename,
                });
                anchor.get(0).click();
            }

        }.bind(this),
        function reject(err) {
            console.log(err);
        }
    );
    
}

function setError(message) {
    //Añadimos alert antes del table
    $(".alert").remove();
    var alert = new Object();
    alert["class"] = "alert alert-danger";
    alert["role"] = "alert";
    $("#div-errors").append($("<div/>", alert).text(message));
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
