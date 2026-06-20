(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });
    start();
  }

  function initFilter() {
    var input = document.querySelector("[data-filter-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-card]"));
    var clear = document.querySelector("[data-filter-clear]");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]"));
    if (!input || !cards.length) {
      return;
    }
    var activeValue = "";

    function applyFilter() {
      var query = normalize(input.value + " " + activeValue);
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search-text"));
        card.classList.toggle("is-filter-hidden", query && text.indexOf(query) === -1);
      });
    }

    input.addEventListener("input", function () {
      activeValue = "";
      buttons.forEach(function (button) {
        button.classList.remove("active");
      });
      applyFilter();
    });
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeValue = button.getAttribute("data-filter-value") || "";
        buttons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        applyFilter();
      });
    });
    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        activeValue = "";
        buttons.forEach(function (button) {
          button.classList.remove("active");
        });
        applyFilter();
      });
    }
  }

  function buildSearchCard(item) {
    return [
      '<a class="movie-card" href="' + escapeHtml(item.url) + '">',
      '  <span class="card-cover">',
      '    <img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '    <span class="card-shade"></span>',
      '    <span class="card-category">' + escapeHtml(item.category) + '</span>',
      '    <span class="card-play">▶</span>',
      '  </span>',
      '  <span class="card-body">',
      '    <strong>' + escapeHtml(item.title) + '</strong>',
      '    <span>' + escapeHtml(item.oneLine) + '</span>',
      '    <em>★ ' + escapeHtml(item.rating) + ' · ' + escapeHtml(item.year) + '</em>',
      '  </span>',
      '</a>'
    ].join("");
  }

  function initSearchPage() {
    var data = window.SEARCH_DATA;
    var results = document.getElementById("search-results");
    var input = document.getElementById("search-input");
    var output = document.getElementById("search-output");
    if (!Array.isArray(data) || !results || !input || !output) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (!query) {
      return;
    }
    input.value = query;
    var words = normalize(query).split(/\s+/).filter(Boolean);
    var matches = data.filter(function (item) {
      var text = normalize(item.text);
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).slice(0, 80);
    var heading = output.querySelector(".section-head h2");
    if (heading) {
      heading.textContent = "搜索结果：“" + query + "”";
    }
    if (matches.length) {
      results.innerHTML = matches.map(buildSearchCard).join("");
    } else {
      results.innerHTML = '<div class="empty-card"><h2>未找到相关视频</h2><p>可以尝试更短的片名、地区、类型或标签。</p></div>';
    }
  }

  ready(function () {
    initMenu();
    initHero();
    initFilter();
    initSearchPage();
  });
})();
