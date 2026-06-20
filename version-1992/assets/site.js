(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function setupNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("is-active", position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("is-active", position === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });
    restart();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupSearch() {
    var input = document.querySelector("[data-search-input]");
    var area = document.querySelector("[data-search-area]");
    if (!input || !area) {
      return;
    }
    var cards = Array.prototype.slice.call(area.querySelectorAll("[data-search-card]"));
    var activeFilter = "全部";
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");
    if (initialQuery) {
      input.value = initialQuery;
    }

    function cardText(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year"),
        card.getAttribute("data-tags")
      ].join(" ").toLowerCase();
    }

    function apply() {
      var query = normalize(input.value);
      cards.forEach(function (card) {
        var text = cardText(card);
        var type = card.getAttribute("data-type") || "";
        var passesQuery = !query || text.indexOf(query) !== -1;
        var passesFilter = activeFilter === "全部" || type === activeFilter || text.indexOf(activeFilter.toLowerCase()) !== -1;
        card.hidden = !(passesQuery && passesFilter);
      });
    }

    input.addEventListener("input", apply);
    document.querySelectorAll("[data-filter-value]").forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter-value") || "全部";
        document.querySelectorAll("[data-filter-value]").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        apply();
      });
    });
    apply();
  }

  window.setupMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var button = document.getElementById(options.buttonId);
    var prepared = false;
    var hlsInstance = null;

    if (!video || !options.source) {
      return;
    }

    function attach() {
      if (prepared) {
        return;
      }
      prepared = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.source;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(options.source);
        hlsInstance.attachMedia(video);
        return;
      }
      video.src = options.source;
    }

    function start(event) {
      if (event) {
        event.preventDefault();
      }
      attach();
      video.controls = true;
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var playRequest = video.play();
      if (playRequest && typeof playRequest.catch === "function") {
        playRequest.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }
    if (button) {
      button.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance && typeof hlsInstance.destroy === "function") {
        hlsInstance.destroy();
      }
    });
  };

  ready(function () {
    setupNavigation();
    setupHero();
    setupSearch();
  });
})();
