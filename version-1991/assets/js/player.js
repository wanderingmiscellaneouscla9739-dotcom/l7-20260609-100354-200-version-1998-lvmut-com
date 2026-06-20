import { H as Hls } from './hls-vendor-dru42stk.js';

(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.player-wrap'));

  players.forEach(function (wrap) {
    var video = wrap.querySelector('video');
    var overlay = wrap.querySelector('.player-overlay');

    if (!video) {
      return;
    }

    var stream = video.getAttribute('data-stream');
    var hls = null;

    function attachStream() {
      if (!stream || video.getAttribute('data-ready') === 'true') {
        return;
      }

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal || !hls) {
            return;
          }

          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      }

      video.setAttribute('data-ready', 'true');
    }

    function playVideo() {
      attachStream();
      var playPromise = video.play();

      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(function () {
          if (overlay) {
            overlay.classList.add('is-hidden');
          }
        }).catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      } else if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    attachStream();

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (overlay && video.currentTime === 0) {
        overlay.classList.remove('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  });
})();
