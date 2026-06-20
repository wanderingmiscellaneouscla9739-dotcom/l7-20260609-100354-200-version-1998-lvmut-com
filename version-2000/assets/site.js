(function() {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function() {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");
    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function() {
        mobileMenu.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var heroIndex = 0;
    var timer = null;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function(slide, itemIndex) {
        slide.classList.toggle("is-active", itemIndex === heroIndex);
      });
      dots.forEach(function(dot, itemIndex) {
        dot.classList.toggle("is-active", itemIndex === heroIndex);
      });
    }

    function startHero() {
      if (!slides.length) {
        return;
      }
      window.clearInterval(timer);
      timer = window.setInterval(function() {
        showHero(heroIndex + 1);
      }, 5200);
    }

    dots.forEach(function(dot, itemIndex) {
      dot.addEventListener("click", function() {
        showHero(itemIndex);
        startHero();
      });
    });

    if (prev) {
      prev.addEventListener("click", function() {
        showHero(heroIndex - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener("click", function() {
        showHero(heroIndex + 1);
        startHero();
      });
    }

    startHero();

    var searchInput = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]"));
    var emptyState = document.querySelector("[data-empty-state]");
    var activeFilter = "all";

    function cardText(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-category"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year"),
        card.getAttribute("data-tags")
      ].join(" ").toLowerCase();
    }

    function applyFilters() {
      if (!cards.length) {
        return;
      }
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var visible = 0;
      cards.forEach(function(card) {
        var text = cardText(card);
        var filterMatch = activeFilter === "all" || text.indexOf(activeFilter.toLowerCase()) !== -1;
        var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
        var show = filterMatch && keywordMatch;
        card.style.display = show ? "" : "none";
        if (show) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    chips.forEach(function(chip) {
      chip.addEventListener("click", function() {
        activeFilter = chip.getAttribute("data-filter-value") || "all";
        chips.forEach(function(item) {
          item.classList.toggle("is-active", item === chip);
        });
        applyFilters();
      });
    });

    applyFilters();
  });
}());
