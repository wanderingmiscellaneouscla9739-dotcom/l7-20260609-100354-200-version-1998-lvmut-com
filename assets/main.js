(function () {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    const show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  const scopes = Array.from(document.querySelectorAll('[data-filter-scope]'));

  const normalize = function (value) {
    return String(value || '').trim().toLowerCase();
  };

  scopes.forEach(function (scope) {
    const form = scope.querySelector('[data-filter-form]');
    const input = scope.querySelector('[data-search-input]');
    const region = scope.querySelector('[data-region-filter]');
    const year = scope.querySelector('[data-year-filter]');
    const category = scope.querySelector('[data-category-filter]');
    const chips = Array.from(scope.querySelectorAll('[data-genre-button]'));
    const list = scope.parentElement.querySelector('[data-card-list]') || document;
    const cards = Array.from(list.querySelectorAll('.filter-card'));
    let selectedGenre = '';

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');

    if (initialQuery && input) {
      input.value = initialQuery;
    }

    const apply = function () {
      const query = normalize(input ? input.value : '');
      const regionValue = region ? region.value : '';
      const yearValue = year ? year.value : '';
      const categoryValue = category ? category.value : '';

      cards.forEach(function (card) {
        const titleText = normalize(card.getAttribute('data-title'));
        const genreText = normalize(card.getAttribute('data-genre'));
        const regionText = card.getAttribute('data-region') || '';
        const yearText = card.getAttribute('data-year') || '';
        const categoryText = card.getAttribute('data-category') || '';
        const matchQuery = !query || titleText.indexOf(query) !== -1;
        const matchRegion = !regionValue || regionText === regionValue;
        const matchYear = !yearValue || yearText === yearValue;
        const matchCategory = !categoryValue || categoryText === categoryValue;
        const matchGenre = !selectedGenre || genreText.indexOf(normalize(selectedGenre)) !== -1 || titleText.indexOf(normalize(selectedGenre)) !== -1;
        card.classList.toggle('hidden', !(matchQuery && matchRegion && matchYear && matchCategory && matchGenre));
      });
    };

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        apply();
      });
    }

    [input, region, year, category].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        selectedGenre = chip.getAttribute('data-genre-button') || '';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        apply();
      });
    });

    apply();
  });
})();
