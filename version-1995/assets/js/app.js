(function () {
    var navButton = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (navButton && mobileNav) {
        navButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
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

    function nextSlide() {
        showSlide(current + 1);
    }

    function restartTimer() {
        if (timer) {
            clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = setInterval(nextSlide, 5200);
        }
    }

    var prevButton = document.querySelector('[data-hero-prev]');
    var nextButton = document.querySelector('[data-hero-next]');

    if (prevButton) {
        prevButton.addEventListener('click', function () {
            showSlide(current - 1);
            restartTimer();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function () {
            showSlide(current + 1);
            restartTimer();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
            restartTimer();
        });
    });

    showSlide(0);
    restartTimer();

    Array.prototype.slice.call(document.querySelectorAll('[data-catalog-controls]')).forEach(function (controls) {
        var scope = controls.parentElement;
        var input = controls.querySelector('input[name="q"]');
        var type = controls.querySelector('select[name="type"]');
        var year = controls.querySelector('select[name="year"]');
        var reset = controls.querySelector('[data-reset-filter]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            var query = normalize(input && input.value);
            var typeValue = normalize(type && type.value);
            var yearValue = normalize(year && year.value);

            cards.forEach(function (card) {
                var titleText = normalize(card.getAttribute('data-title'));
                var regionText = normalize(card.getAttribute('data-region'));
                var genreText = normalize(card.getAttribute('data-genre'));
                var typeText = normalize(card.getAttribute('data-type'));
                var yearText = normalize(card.getAttribute('data-year'));
                var searchText = titleText + ' ' + regionText + ' ' + genreText + ' ' + typeText + ' ' + yearText;
                var matchedQuery = !query || searchText.indexOf(query) !== -1;
                var matchedType = !typeValue || typeText.indexOf(typeValue) !== -1;
                var matchedYear = !yearValue || yearText === yearValue;
                card.hidden = !(matchedQuery && matchedType && matchedYear);
            });
        }

        [input, type, year].forEach(function (node) {
            if (node) {
                node.addEventListener('input', applyFilter);
                node.addEventListener('change', applyFilter);
            }
        });

        if (reset) {
            reset.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }
                if (type) {
                    type.value = '';
                }
                if (year) {
                    year.value = '';
                }
                applyFilter();
            });
        }
    });
})();
