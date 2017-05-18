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
            var img = {};
            img["class"] = "img-responsive";
            img["width"] = 150;
            img["height"] = 100;
            img["src"]="PDF.png";

            $("#div-files").append(
                $('<div/>', div).append(
                    $('<a/>', a).append(
                        $('<img/>', img).append()),
                        $('<h1/>').text(key).append()
                )
            );

        }
    }
    $("a[data-url]").click(function(){
        downloadUrlApi($(this).data("url"));
    });
}

function downloadUrlApi(url) {
    var username = readCookie("username");
    var password = readCookie("password");


    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.withCredentials = 'true';
    xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    xhr.onload = function () {
        if (this.status === 200) {
            var filename = "";
            var disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }
            var type = xhr.getResponseHeader('Content-Type');

            var blob = new Blob([this.response], { type: type });
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);

                if (filename) {
                    // use HTML5 a[download] attribute to specify filename
                    var a = document.createElement("a");
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        window.location = downloadUrl;
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    window.location = downloadUrl;
                }

                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
            }
        }
    };
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

$(document).ready(function() {
    testCookies();
    setUser();
    getFilesAPI();

    $("#logout").click(function() {
        logout();
    })
});
