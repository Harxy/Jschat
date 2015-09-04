$(function () {
    var roomArray = window.location.pathname.split('/');
    roomName = roomArray[2];
    var client = new Faye.Client('/faye');
    
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
