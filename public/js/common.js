var commonMethods = function () {

};

commonMethods.prototype.sendReq = function (url, params, callback, type, option) {
    var result;
    $.ajax({
        async: callback ? true : false,
        timeout: 150000,
        type: type ? type : 'GET',
        url: url,
        data: params,
        processData: option && option.type == 'file' ? false : true,
        dataType: option && option.dataType ? option.dataType : 'json',
        contentType: option && option.type == 'file' ? false : 'application/x-www-form-urlencoded;charset=UTF-8',
        success: function(data) {
            var curData = data;
            if (callback) {
                callback(curData);
            } else {
                result = curData;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    return result;
};

var $commonMethods = new commonMethods();