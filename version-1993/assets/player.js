(function() {
  function initializeVideo(video, source, overlay) {
    if (!video || !source || video.getAttribute("data-ready") === "1") {
      return;
    }
    video.setAttribute("data-ready", "1");
    var hlsPlayer = null;
    function playVideo() {
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function() {});
      }
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
      playVideo();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsPlayer = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsPlayer.loadSource(source);
      hlsPlayer.attachMedia(video);
      hlsPlayer.on(window.Hls.Events.MANIFEST_PARSED, function() {
        playVideo();
      });
      hlsPlayer.on(window.Hls.Events.ERROR, function(event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hlsPlayer.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hlsPlayer.recoverMediaError();
        } else {
          hlsPlayer.destroy();
        }
      });
      video._hlsPlayer = hlsPlayer;
      return;
    }
    video.src = source;
    video.addEventListener("loadedmetadata", playVideo, { once: true });
    playVideo();
  }

  function initPlayer(shell) {
    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".player-overlay");
    var source = shell.getAttribute("data-stream");
    function start() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      initializeVideo(video, source, overlay);
      if (video && video.getAttribute("data-ready") === "1") {
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function() {});
        }
      }
    }
    if (overlay) {
      overlay.addEventListener("click", start);
    }
    if (video) {
      video.addEventListener("click", function() {
        if (video.getAttribute("data-ready") !== "1") {
          start();
        }
      });
      video.addEventListener("play", function() {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    Array.prototype.slice.call(document.querySelectorAll(".player-shell")).forEach(initPlayer);
  });
})();
