(function() {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, function(char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        "\"": "&quot;"
      }[char];
    });
  }

  function initMobileNav() {
    var button = $(".mobile-toggle");
    var nav = $(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function() {
      var open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    $all("[data-hero]").forEach(function(hero) {
      var slides = $all(".hero-slide", hero);
      var dots = $all("[data-hero-dot]", hero);
      var prev = $("[data-hero-prev]", hero);
      var next = $("[data-hero-next]", hero);
      if (!slides.length) {
        return;
      }
      var index = 0;
      var timer = null;
      function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function(slide, pos) {
          slide.classList.toggle("is-active", pos === index);
        });
        dots.forEach(function(dot, pos) {
          dot.classList.toggle("is-active", pos === index);
        });
      }
      function move(step) {
        show(index + step);
      }
      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function() {
          move(1);
        }, 5000);
      }
      if (prev) {
        prev.addEventListener("click", function() {
          move(-1);
          restart();
        });
      }
      if (next) {
        next.addEventListener("click", function() {
          move(1);
          restart();
        });
      }
      dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          restart();
        });
      });
      restart();
    });
  }

  function initRails() {
    $all("[data-scroll]").forEach(function(button) {
      button.addEventListener("click", function() {
        var target = document.getElementById(button.getAttribute("data-scroll-target"));
        if (!target) {
          return;
        }
        var direction = button.getAttribute("data-scroll") === "left" ? -1 : 1;
        target.scrollBy({ left: direction * 340, behavior: "smooth" });
      });
    });
  }

  function initCardFilter() {
    $all("[data-card-filter]").forEach(function(input) {
      var section = input.closest(".catalog-section") || document;
      var cards = $all(".movie-card", section);
      input.addEventListener("input", function() {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function(card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          card.style.display = !query || haystack.indexOf(query) !== -1 ? "" : "none";
        });
      });
    });
  }

  function renderSearchResults(results, box) {
    if (!box) {
      return;
    }
    if (!results.length) {
      box.innerHTML = "";
      return;
    }
    box.innerHTML = results.slice(0, 18).map(function(item) {
      return "<a class=\"search-result-item\" href=\"" + escapeHtml(item.link) + "\">" +
        "<img src=\"" + escapeHtml(item.image) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">" +
        "<span><strong>" + escapeHtml(item.title) + "</strong>" +
        "<p>" + escapeHtml(item.meta) + "</p>" +
        "<p>" + escapeHtml(item.text) + "</p></span></a>";
    }).join("");
  }

  function initSearch() {
    var form = document.getElementById("site-search-form");
    var box = document.getElementById("search-results");
    if (!form || !box || !window.SEARCH_DATA) {
      return;
    }
    var input = form.querySelector("input[name='q']");
    var type = form.querySelector("select[name='type']");
    function run() {
      var query = (input && input.value ? input.value : "").trim().toLowerCase();
      var typeValue = type && type.value ? type.value : "";
      if (!query && !typeValue) {
        box.innerHTML = "";
        return;
      }
      var results = window.SEARCH_DATA.filter(function(item) {
        var matchQuery = !query || item.search.indexOf(query) !== -1;
        var matchType = !typeValue || item.type.indexOf(typeValue) !== -1 || item.genre.indexOf(typeValue) !== -1;
        return matchQuery && matchType;
      });
      renderSearchResults(results, box);
    }
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      run();
    });
    if (input) {
      input.addEventListener("input", run);
    }
    if (type) {
      type.addEventListener("change", run);
    }
    var params = new URLSearchParams(window.location.search);
    if (input && params.get("q")) {
      input.value = params.get("q");
      run();
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    initMobileNav();
    initHero();
    initRails();
    initCardFilter();
    initSearch();
  });
})();
