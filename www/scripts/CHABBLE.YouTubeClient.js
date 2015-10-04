var CHABBLE = CHABBLE || {};

CHABBLE.YouTubeClient = (function() {
    var youTubePlayer;
    var playState;
    var playStates =
    {
        "unstarted": -1,
        "ended": 0,
        "playing": 1,
        "paused": 2,
        "buffering": 3,
        "videoCued": 5
    };
    var readyCallback;
    var finishedCallback;
    var readyToPlay;

    var audioStates = {
        "mute": 0,
        "unmute": 1
    };

    function playYouTubeVideo(videoId, startTime) {
        var currentTime = youTubePlayer.getCurrentTime();
        var outBy = Math.abs(currentTime - startTime);

        if ((playState === playStates.playing && outBy < 10) || playState === playStates.buffering)
            return;

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
    
    function setAudioState(audioState) {
        if (audioState === audioStates.mute) {
            youTubePlayer.mute();
        } else if (audioState === audioStates.unmute) {
            youTubePlayer.unMute();
        }
    }

    function initPlayer() {
        readyToPlay = false;
        var tag = document.createElement("script");

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function() {
            iFrameReady();
        };

    }

    function onPlayerReady(event) {
        if (typeof readyCallback !== "undefined")
            readyCallback();
        readyToPlay = true;
    }

    function onStateChange(event) {
        playState = event.data;

        if (playState === 0) {
            if (typeof finishedCallback !== "undefined") {
                finishedCallback();
            }
        }
    }

    function stopVideo() {
        youTubePlayer.stopVideo();
    }

    return {
        Init: function() {
            initPlayer();
        },
        Play: function(videoId, startTime) {
            playYouTubeVideo(videoId, startTime);
        },
        Stop: function() {
            stopVideo();
        },
        PlayerReady: readyToPlay,
        OnPlayerReady: function(callback) {
            readyCallback = callback;
        },
        OnVideoFinished: function(callback) {
            finishedCallback = callback;
        },
        Mute: function() {
            setAudioState(audioStates.mute);
        },
        UnMute: function () {
            setAudioState(audioStates.unmute);
        }
    };
})();