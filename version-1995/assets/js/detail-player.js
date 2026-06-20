(function () {
    function attach(container) {
        var video = container.querySelector('video');
        var overlay = container.querySelector('[data-player-overlay]');
        var url = container.getAttribute('data-video-url');

        if (!video || !url) {
            return;
        }

        function prepare() {
            if (video.getAttribute('data-ready') === '1') {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                container._hls = hls;
            } else {
                video.src = url;
            }

            video.setAttribute('data-ready', '1');
            video.controls = true;
        }

        function start() {
            prepare();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            var playResult = video.play();
            if (playResult && typeof playResult.catch === 'function') {
                playResult.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
    }

    function init() {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(attach);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
