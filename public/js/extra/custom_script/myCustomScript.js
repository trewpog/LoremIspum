/**
 * The custom script for the Request with AJAX
 * */
function ajaxRequest(typeRequest, url , data , callback) {
    $.ajax({
        type    : typeRequest,
        url     : url,
        data    : data,

        success : function(data) {

            if(typeof callback == 'function') {
                callback(data);
            }
        },
        done : function(data) {

            if(typeof callback == 'function') {
                callback(data);
            }
        },
        error : function(data) {

            if(typeof callback == 'function') {
                console.log( 'Error Ajax request' );
                ajaxRequestFailMsg(data);
            }
        }
    });
}

/**
 * Return the modal with all Errors if Ajax request fail
 * */
function ajaxRequestFailMsg(call) {

    call.error(function (call) {
        $('#myModalNotifyMsg').modal({backdrop: 'static', keyboard: false});
        // set and/or replace the html code inside it
        $("#notificationMsg").html(call.responseText);

    });

}

/**
 * Agenda, validation before Ajax Request
 * */
function validateFieldsIfEmptyAgenda() {

    var validateBoolean          = true;
    
    if ($('.col-sm-5 #first_name').val() == '') {
        $('.col-sm-5 #first_name').css('border-color', '#FF0000');
        validateBoolean = false;
    } else {
        $('.col-sm-5 #first_name').css('border-color', '');
    }
    if ($('.col-sm-5 #last_name').val() == '') {
        $('.col-sm-5 #last_name').css('border-color', '#FF0000');
        validateBoolean = false;
    } else {
        $('.col-sm-5 #last_name').css('border-color', '');
    }
    if ($('#title').val() == '') {
        $('#title').css('border-color', '#FF0000');
        validateBoolean = false;
    } else {
        $('#title').css('border-color', '');
    }
    if ($('#content').val() == '') {
        $('#content').css('border-color', '#FF0000');
        validateBoolean = false;
    } else {
        $('#content').css('border-color', '');
    }
    if ($('#time').val() == '') {
        $('#time').css('border-color', '#FF0000');
        validateBoolean = false;
    } else {
        $('#time').css('border-color', '');
    }

    return validateBoolean;
}

function formatDigitsDate(inputDate) {

    if (inputDate < 10)
        return '0' + inputDate;
    else
        return inputDate;
}
