"use strict";

function doSomethingAsync(config, cb) {
    var url = config.url;
    delete config.url;

    var data = config.data;
    if(config.formData == true){
        var formData = new FormData();

        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        config.body = formData;
    } else {
        config.body = data;
    }

    var headers = {};
    config.headers.forEach(elem => {
        headers[elem[0]] = elem[1];
    });
    config.headers = headers;

    if(config.method == "GET" || config.method == "DELETE"){
        config.params = config.data;
        delete config.data;
    } else if (config.method == "POST") {
        delete config.data;
    }

    fetch(url, config)
        .then(res => res.json())
        .then(data => {
            console.log("SUCCESS ----->", JSON.stringify(data));
            cb(false, data);
        }).catch(err => {
            console.log("ERROR ----->", err);
            cb(true, err);
        });
}

exports._fetch = function (config) {
    return function (onError, onSuccess) {
        var cancel = doSomethingAsync(config, function (err, res) {
            if (err) {
                onError(res);
            } else {
                onSuccess(res);
            }
        });
        return function (cancelError, onCancelerError, onCancelerSuccess) {
            cancel();
            onCancelerSuccess();
        }
    }
}