(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var previous = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var current = 0;
  var timer = null;

  function showSlide(index) {
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

  function startSlider() {
    if (slides.length < 2) {
      return;
    }

    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      startSlider();
    });
  });

  if (previous) {
    previous.addEventListener('click', function () {
      showSlide(current - 1);
      startSlider();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      startSlider();
    });
  }

  showSlide(0);
  startSlider();

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.js-search'));

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function applyFilters(scope) {
    var input = scope.querySelector('.js-search');
    var active = scope.querySelector('.js-filter.is-active');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var empty = scope.querySelector('.no-results');
    var query = normalize(input ? input.value : '');
    var filter = active ? active.getAttribute('data-filter') : 'all';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var tags = normalize([
        card.getAttribute('data-tags'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year')
      ].join(' '));
      var queryMatch = !query || haystack.indexOf(query) !== -1;
      var filterMatch = !filter || filter === 'all' || tags.indexOf(normalize(filter)) !== -1;
      var matched = queryMatch && filterMatch;

      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.style.display = visible ? 'none' : 'block';
    }
  }

  searchInputs.forEach(function (input) {
    var scope = input.closest('.js-search-scope') || document;
    input.addEventListener('input', function () {
      applyFilters(scope);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('.js-filter')).forEach(function (button) {
    button.addEventListener('click', function () {
      var scope = button.closest('.js-search-scope') || document;
      Array.prototype.slice.call(scope.querySelectorAll('.js-filter')).forEach(function (item) {
        item.classList.remove('is-active');
      });
      button.classList.add('is-active');
      applyFilters(scope);
    });
  });
})();
