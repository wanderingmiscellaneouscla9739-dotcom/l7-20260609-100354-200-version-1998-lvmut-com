(function () {
  const playerScript = document.currentScript ? document.currentScript.src : './assets/player.js';
  const vendorUrl = playerScript.replace(/player\.js(?:\?.*)?$/, 'hls-vendor.js');
  let hlsClass = window.Hls || null;

  const getHls = async function () {
    if (hlsClass) {
      return hlsClass;
    }

    try {
      const module = await import(vendorUrl);
      hlsClass = module.H;
      return hlsClass;
    } catch (error) {
      return null;
    }
  };

  const setup = function (box) {
    const video = box.querySelector('video');
    const button = box.querySelector('.center-play');
    const stream = box.getAttribute('data-stream');
    let ready = false;
    let hls = null;

    if (!video || !stream) {
      return;
    }

    const attach = async function () {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }

      const Hls = await getHls();

      if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    };

    const start = async function () {
      await attach();
      video.setAttribute('controls', 'controls');
      box.classList.add('is-playing');

      try {
        await video.play();
      } catch (error) {
        box.classList.remove('is-playing');
      }
    };

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        start();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      box.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      box.classList.remove('is-playing');
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  document.querySelectorAll('[data-player]').forEach(setup);
})();
