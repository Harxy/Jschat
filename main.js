﻿$(function () {
    var roomArray = window.location.pathname.split('/');
    roomName = roomArray[2];
    var client = new Faye.Client('/faye');
    
    setUsername();
    subscribeToRoom(client, roomName);
    loadHistory();

    $('#theme-picker').change(function () {
        $('body').removeClass();
        $('body').addClass(this.value);
    });
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
        addToScreen(message.name, message.text, message.timeString);
        $.titleAlert("New!", {
            requireBlur: true,
            stopOnFocus: true,
            duration: 15000,
            interval: 700
        });
    });
}

function sendMessage(client, roomName, username, message) {
    var time = new Date();
    var timeString = time.toTimeString().split(' ')[0];

    client.publish('/rooms/' + roomName, {
        text: message,
        name: username,
        timeString: timeString
    });

    createCookie("username", username);
}

function loadHistory() {
    $.getJSON("/history/" + roomName, function (data) {
        $.each(data, function (key, val) {
            addToScreen(data[key].data.name, data[key].data.text, data[key].data.timeString);
        });
    });
}

function addToScreen(name, message, timeString) {   
    $('#output').prepend('<div class="message"><div class="name">' + name + '<span>' + timeString + '</span></div><div class="body">' + message + '</div></div>');
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