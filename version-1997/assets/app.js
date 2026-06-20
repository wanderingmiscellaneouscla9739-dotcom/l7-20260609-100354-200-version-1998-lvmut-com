(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var opened = mobileNav.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var activeIndex = 0;
    var heroTimer = null;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === activeIndex);
        });
    }

    function startHero() {
        if (heroTimer || slides.length < 2) {
            return;
        }
        heroTimer = window.setInterval(function () {
            showHero(activeIndex + 1);
        }, 5200);
    }

    function resetHero() {
        if (heroTimer) {
            window.clearInterval(heroTimer);
            heroTimer = null;
        }
        startHero();
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showHero(index);
            resetHero();
        });
    });

    if (prev) {
        prev.addEventListener('click', function () {
            showHero(activeIndex - 1);
            resetHero();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showHero(activeIndex + 1);
            resetHero();
        });
    }

    showHero(0);
    startHero();

    var searchInput = document.querySelector('[data-movie-search]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var list = document.querySelector('[data-movie-list]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function filterMovies() {
        if (!list) {
            return;
        }
        var keyword = normalize(searchInput && searchInput.value);
        var year = normalize(yearSelect && yearSelect.value);
        var type = normalize(typeSelect && typeSelect.value);
        var cards = list.querySelectorAll('.movie-card');

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-category'),
                card.textContent
            ].join(' '));
            var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchYear = !year || normalize(card.getAttribute('data-year')) === year;
            var cardType = normalize(card.getAttribute('data-type'));
            var matchType = !type || cardType.indexOf(type) !== -1 || haystack.indexOf(type) !== -1;
            card.classList.toggle('is-hidden', !(matchKeyword && matchYear && matchType));
        });
    }

    [searchInput, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
            control.addEventListener('input', filterMovies);
            control.addEventListener('change', filterMovies);
        }
    });
})();
