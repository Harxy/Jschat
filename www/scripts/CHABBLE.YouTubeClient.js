var CHABBLE = CHABBLE || {};

CHABBLE.YouTubeClient = (function () {
    var youTubePlayer;
    var playState;
    var readyCallback;
    
    function playYouTubeVideo(videoId, startTime) {
        youTubePlayer.cueVideoById({
            videoId: videoId,
            startSeconds: startTime
        });
        
        youTubePlayer.playVideo();
    }
    
    function iFrameReady() {
        youTubePlayer = new YT.Player("player", {
            playerVars: {
                'controls': 0,
                'enablejsapi': 1,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onStateChange
            }
        });
    }
    
    function initPlayer() {
        var tag = document.createElement("script");
        
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = function () {
            iFrameReady();
        };

    }
    
    function onPlayerReady(event) {
        readyCallback();
    }
    
    function onStateChange(event) {
        playState = event.data;
        console.log(playState);
        if (playState === 1) {
            
        }
    }
    
    function stopVideo() {
        youTubePlayer.stopVideo();
    }
    
    return {
        init: function () {
            initPlayer();
        },
        play: function (videoId, startTime) {
            playYouTubeVideo(videoId, startTime);
        },
        stop: function () {
            stopVideo();
        },
        playerReady: function (callback) {
            readyCallback = callback;
        }
    };
})();