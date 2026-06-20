(function () {
    function loadHls(callback) {
        if (window.Hls) {
            callback();
            return;
        }

        var existing = document.querySelector('script[data-hls-loader]');
        if (existing) {
            existing.addEventListener('load', callback, { once: true });
            return;
        }

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
        script.async = true;
        script.setAttribute('data-hls-loader', 'true');
        script.addEventListener('load', callback, { once: true });
        document.head.appendChild(script);
    }

    function tryPlay(video) {
        var action = video.play();
        if (action && typeof action.catch === 'function') {
            action.catch(function () {});
        }
    }

    function attach(video, stream, done) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            done();
            return;
        }

        loadHls(function () {
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, done);
            } else {
                video.src = stream;
                done();
            }
        });
    }

    function create(options) {
        var video = document.getElementById(options.video);
        var button = document.getElementById(options.button);
        var overlay = document.getElementById(options.overlay);
        var started = false;

        if (!video || !options.stream) {
            return;
        }

        function begin() {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            if (started) {
                tryPlay(video);
                return;
            }
            started = true;
            attach(video, options.stream, function () {
                tryPlay(video);
            });
        }

        if (button) {
            button.addEventListener('click', begin);
        }

        video.addEventListener('click', function () {
            if (!started || video.paused) {
                begin();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });
    }

    window.MoviePlayer = {
        create: create
    };
})();
