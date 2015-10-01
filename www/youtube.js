var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        events: {
            'onReady': onPlayerReady,
        }
    });
}

function onPlayerReady(event) {
    player.cueVideoById({
        videoId: 'kfVsfOSbJY0',
        startSeconds: 30
    });

    event.target.playVideo();
}

var done = false;

function stopVideo() {
    player.stopVideo();
}