$(function () {
    var roomArray = window.location.pathname.split('/');
    roomName = roomArray[2];
    var client = new Faye.Client('/faye');
    
    setUsername();
    subscribeToRoom(client, roomName);
    loadHistory();

    $('#input').keyup(function (e) {
        var message = $('#input').val();
        var userName = $('#name').val();
        if (e.keyCode === 13 && message != null && message != '') {
            sendMessage(client, roomName, userName, message);      
            $('#input').val('');
        }
    });

    $('#input').focus();
});

function setUsername() {
    var userName = readCookie("username");
    if (userName)
        $('#name').val(userName);
    else
        $('#name').val("Anon");
}

function subscribeToRoom(client, roomName) {
    client.subscribe('/rooms/' + roomName, function (message) {
        addToScreen(message.name, message.text);
        $.titleAlert("New!", {
            requireBlur: true,
            stopOnFocus: true,
            duration: 15000,
            interval: 700
        });
    });
}

function sendMessage(client, roomName, username, message) {
    client.publish('/rooms/' + roomName, {
        text: message,
        name: username
    });

    createCookie("username", username);
}

function loadHistory() {
    $.getJSON("/history/" + roomName, function (data) {
        $.each(data, function (key, val) {
            addToScreen(data[key].data.name, data[key].data.text);
        });
    });
}

function addToScreen(name, message) {
    $('#output').prepend('<p>' + name + ': ' + message + '</p>');
}


function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
