function initVideoPlayer(source) {
  var video = document.querySelector('[data-player-video]');
  var cover = document.querySelector('[data-player-cover]');
  var playButton = document.querySelector('[data-player-start]');
  var ready = false;
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  function bindSource() {
    if (ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }

    ready = true;
  }

  function start() {
    bindSource();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    video.controls = true;
    var playTask = video.play();

    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {});
    }
  }

  if (playButton) {
    playButton.addEventListener('click', start);
  }

  if (cover) {
    cover.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (!ready) {
      start();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
