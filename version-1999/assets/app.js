(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function activateSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      activateSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    activateSlide(0);
    setInterval(function () {
      activateSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var yearSelect = document.querySelector('[data-year-select]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var activeGenre = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    var keyword = normalize(searchInput ? searchInput.value : '');
    var year = yearSelect ? yearSelect.value : 'all';
    var visibleCount = 0;

    cards.forEach(function (card) {
      var text = normalize(card.textContent + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-genre'));
      var cardYear = card.getAttribute('data-year') || '';
      var genre = normalize(card.getAttribute('data-genre'));
      var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchesYear = year === 'all' || cardYear === year;
      var matchesGenre = activeGenre === 'all' || genre.indexOf(activeGenre) !== -1;
      var visible = matchesKeyword && matchesYear && matchesGenre;

      card.style.display = visible ? '' : 'none';

      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', applyFilters);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeGenre = normalize(button.getAttribute('data-filter-button')) || 'all';

      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });

      applyFilters();
    });
  });
})();
