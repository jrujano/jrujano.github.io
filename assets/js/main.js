(function () {
    'use strict';

    var root = document.documentElement;
    var translations = window.SITE_TRANSLATIONS || {};
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // main.js is running, so the no-JavaScript safety net is not needed.
    if (window.__revealFallback) {
        window.clearTimeout(window.__revealFallback);
    }

    var header = document.getElementById('site-header');
    var menuToggle = document.getElementById('menu-toggle');
    var mobileNav = document.getElementById('mobile-nav');
    var themeToggle = document.getElementById('theme-toggle');
    var langToggle = document.getElementById('lang-toggle');
    var langStatus = document.getElementById('lang-status');
    var year = document.getElementById('year');

    var currentLang = 'es';
    var menuMedia = window.matchMedia('(min-width: 961px)');

    /* ---------- Helpers ---------- */
    function setMeta(id, value) {
        var element = document.getElementById(id);
        if (element && value) {
            element.setAttribute('content', value);
        }
    }

    function t(key) {
        var dictionary = translations[currentLang] || {};
        return dictionary[key] || '';
    }

    function updateThemeMeta() {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', root.dataset.theme === 'light' ? '#f7f9fc' : '#070b14');
        }
    }

    function updateThemeLabel() {
        if (!themeToggle) return;
        themeToggle.setAttribute(
            'aria-label',
            t(root.dataset.theme === 'light' ? 'theme.toDark' : 'theme.toLight')
        );
    }

    function updateMenuLabel() {
        if (!menuToggle) return;
        var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-label', t(isOpen ? 'menu.close' : 'menu.open'));
    }

    /* ---------- Language ---------- */
    function getInitialLanguage() {
        try {
            var saved = localStorage.getItem('lang');
            if (saved === 'es' || saved === 'en') return saved;
        } catch (error) {
            /* localStorage can be unavailable in private contexts. */
        }

        var languages = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language || 'es'];

        for (var i = 0; i < languages.length; i += 1) {
            if (String(languages[i]).toLowerCase().indexOf('es') === 0) return 'es';
            if (String(languages[i]).toLowerCase().indexOf('en') === 0) return 'en';
        }

        return 'es';
    }

    function applyLanguage(language, announce) {
        if (!translations[language]) return;

        currentLang = language;
        var dictionary = translations[language];

        document.querySelectorAll('[data-i18n]').forEach(function (element) {
            var key = element.getAttribute('data-i18n');
            if (dictionary[key] !== undefined) {
                element.textContent = dictionary[key];
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(function (element) {
            var key = element.getAttribute('data-i18n-aria');
            if (dictionary[key] !== undefined) {
                element.setAttribute('aria-label', dictionary[key]);
            }
        });

        root.lang = language;
        document.title = dictionary['meta.title'];
        setMeta('meta-description', dictionary['meta.description']);
        setMeta('og-description', dictionary['meta.descriptionShort']);
        setMeta('twitter-description', dictionary['meta.descriptionShort']);

        if (langToggle) {
            langToggle.textContent = language === 'es' ? 'EN' : 'ES';
            langToggle.setAttribute(
                'aria-label',
                dictionary[language === 'es' ? 'lang.switchToEnglish' : 'lang.switchToSpanish']
            );
        }

        try {
            localStorage.setItem('lang', language);
        } catch (error) {
            /* Ignore storage failures. */
        }

        updateMenuLabel();
        updateThemeLabel();

        if (announce && langStatus) {
            langStatus.textContent = dictionary['lang.status'];
        }
    }

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            applyLanguage(currentLang === 'es' ? 'en' : 'es', true);
        });
    }

    /* ---------- Theme ---------- */
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
            root.dataset.theme = nextTheme;
            try {
                localStorage.setItem('theme', nextTheme);
            } catch (error) {
                /* Ignore storage failures. */
            }
            updateThemeMeta();
            updateThemeLabel();
        });
    }

    /* ---------- Mobile menu ---------- */
    function setMenu(open) {
        if (!menuToggle || !mobileNav) return;
        menuToggle.setAttribute('aria-expanded', String(open));
        mobileNav.hidden = !open;
        updateMenuLabel();
    }

    function closeMenu() {
        setMenu(false);
    }

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
        });

        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (event) {
            var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            if (event.key === 'Escape' && isOpen) {
                closeMenu();
                menuToggle.focus();
            }
        });

        document.addEventListener('click', function (event) {
            var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            if (isOpen && header && !header.contains(event.target)) {
                closeMenu();
            }
        });

        var handleBreakpoint = function (event) {
            if (event.matches) closeMenu();
        };

        if (typeof menuMedia.addEventListener === 'function') {
            menuMedia.addEventListener('change', handleBreakpoint);
        } else if (typeof menuMedia.addListener === 'function') {
            menuMedia.addListener(handleBreakpoint);
        }
    }

    /* ---------- Header state ---------- */
    if (header) {
        var updateHeader = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    /* ---------- Reveal on scroll ---------- */
    var revealElements = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        revealElements.forEach(function (element) {
            element.classList.add('is-visible');
        });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    }

    var handleMotionPreference = function (event) {
        if (event.matches) {
            revealElements.forEach(function (element) {
                element.classList.add('is-visible');
            });
        }
    };

    if (typeof reducedMotion.addEventListener === 'function') {
        reducedMotion.addEventListener('change', handleMotionPreference);
    } else if (typeof reducedMotion.addListener === 'function') {
        reducedMotion.addListener(handleMotionPreference);
    }

    /* ---------- Active navigation ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.desktop-nav a[href^="#"]'));
    var navSections = navLinks
        .map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        })
        .filter(Boolean);

    if ('IntersectionObserver' in window && navSections.length) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                navLinks.forEach(function (link) {
                    var isActive = link.getAttribute('href') === '#' + entry.target.id;
                    link.classList.toggle('is-active', isActive);
                    if (isActive) {
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            });
        }, {
            rootMargin: '-42% 0px -52% 0px',
            threshold: 0
        });

        navSections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    /* ---------- Init ---------- */
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    updateThemeMeta();
    applyLanguage(getInitialLanguage(), false);
})();
