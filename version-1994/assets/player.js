function initMoviePlayer(options) {
  var video = document.getElementById(options.videoId);
  var overlay = document.getElementById(options.overlayId);
  var playButton = document.getElementById(options.playButtonId);
  var muteButton = document.getElementById(options.muteButtonId);
  var fullscreenButton = document.getElementById(options.fullscreenButtonId);
  var errorBox = document.getElementById(options.errorId);
  var mounted = false;
  var hls = null;

  if (!video || !overlay || !playButton || !options.source) {
    return;
  }

  function showError(message) {
    if (!errorBox) {
      return;
    }
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function mount() {
    if (mounted) {
      return;
    }
    mounted = true;
    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(options.source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            showError("播放暂时不可用，请稍后再试");
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = options.source;
    } else {
      video.src = options.source;
    }
  }

  function play() {
    mount();
    overlay.classList.add("is-hidden");
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {
        overlay.classList.remove("is-hidden");
      });
    }
  }

  function togglePlay() {
    if (video.paused) {
      play();
    } else {
      video.pause();
    }
  }

  overlay.addEventListener("click", play);
  playButton.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);
  video.addEventListener("play", function () {
    overlay.classList.add("is-hidden");
    playButton.textContent = "Ⅱ";
  });
  video.addEventListener("pause", function () {
    if (!video.ended) {
      overlay.classList.remove("is-hidden");
    }
    playButton.textContent = "▶";
  });
  video.addEventListener("ended", function () {
    overlay.classList.remove("is-hidden");
    playButton.textContent = "▶";
  });

  if (muteButton) {
    muteButton.addEventListener("click", function () {
      video.muted = !video.muted;
      muteButton.textContent = video.muted ? "静音" : "声音";
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    });
  }

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
