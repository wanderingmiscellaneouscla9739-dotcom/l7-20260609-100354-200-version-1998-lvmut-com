(function () {
    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function applySearch(input) {
        var root = input.closest("main") || document;
        var keyword = normalize(input.value);
        var activeFilter = root.getAttribute("data-active-filter") || "all";
        var cards = root.querySelectorAll("[data-card]");

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search") || card.textContent);
            var type = normalize(card.getAttribute("data-type"));
            var matchText = !keyword || text.indexOf(keyword) !== -1;
            var matchFilter = activeFilter === "all" || type.indexOf(normalize(activeFilter)) !== -1 || text.indexOf(normalize(activeFilter)) !== -1;
            card.classList.toggle("is-hidden", !(matchText && matchFilter));
        });
    }

    function initSearch() {
        var inputs = document.querySelectorAll("[data-search-input]");
        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                applySearch(input);
            });
        });

        document.querySelectorAll("[data-clear-search]").forEach(function (button) {
            button.addEventListener("click", function () {
                var panel = button.closest(".search-panel") || document;
                var input = panel.querySelector("[data-search-input]");
                if (input) {
                    input.value = "";
                    applySearch(input);
                    input.focus();
                }
            });
        });

        document.querySelectorAll("[data-filter]").forEach(function (button) {
            button.addEventListener("click", function () {
                var root = button.closest("main") || document;
                root.setAttribute("data-active-filter", button.getAttribute("data-filter") || "all");
                root.querySelectorAll("[data-filter]").forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                var input = root.querySelector("[data-search-input]");
                if (input) {
                    applySearch(input);
                }
            });
        });
    }

    function initNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-site-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var active = 0;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var index = parseInt(dot.getAttribute("data-slide-to") || "0", 10);
                show(index);
            });
        });

        window.setInterval(function () {
            show(active + 1);
        }, 5200);
    }

    window.initVideoPlayer = function (settings) {
        var video = document.getElementById(settings.videoId);
        var overlay = document.getElementById(settings.overlayId);
        var button = document.getElementById(settings.buttonId);
        var loading = document.getElementById(settings.loadingId);
        var source = settings.source;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function hideLoading() {
            if (loading) {
                loading.classList.add("is-hidden");
            }
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, hideLoading);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                } else {
                    hideLoading();
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.addEventListener("loadedmetadata", hideLoading, { once: true });
        } else {
            video.src = source;
            hideLoading();
        }

        function start() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            video.controls = true;
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                start();
            });
        }
        if (overlay) {
            overlay.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("playing", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
    };

    window.initSite = function () {
        initNavigation();
        initSearch();
        initHero();
    };
})();
