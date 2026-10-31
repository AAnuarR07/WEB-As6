$(document).ready(function () {
    console.log('jQuery is ready!');
    const games = [
        { title: 'BeamNG.drive', genre: 'Simulation', image: 'beamng.webp', page: 'index.html' },
        { title: 'Minecraft', genre: 'Sandbox', image: 'minecraft.webp', page: 'minecraft.html' },
        { title: 'Cyberpunk 2077', genre: 'Action', image: 'cyberpunk.webp', page: 'cyberpunk.html' },
        { title: 'GTA V', genre: 'Action', image: 'gta5.webp', page: 'gta5.html' }
    ];
    const $search = $('#live-search');
    const $suggestions = $('#search-suggestions');
    function matchesGame(game, query) {
        return (game.title + ' ' + game.genre).toLowerCase().includes(query);
    }
    function renderSearch() {
        const query = $search.val().trim().toLowerCase();
        const matches = games.filter(game => matchesGame(game, query));
        const $results = $('#live-game-results').empty();
        matches.forEach(function (game) {
            const $card = $('<article>').addClass('jq-game-card');
            $('<img>').attr({ src: 'images/' + game.image, alt: game.title, loading: 'lazy' }).appendTo($card);
            $('<h3>').text(game.title).appendTo($card);
            $('<p>').text(game.genre).appendTo($card);
            $('<a>').attr('href', game.page).text('Explore game').appendTo($card);
            $results.append($card);
        });
        $('#search-count').text(matches.length + ' game(s) found');
        $suggestions.empty();
        if (!query) { $suggestions.prop('hidden', true); return; }
        matches.slice(0, 4).forEach(function (game) {
            $('<li>').append($('<button type="button">').text(game.title).on('click', function () {
                $search.val(game.title);
                renderSearch();
                $suggestions.prop('hidden', true);
            })).appendTo($suggestions);
        });
        $suggestions.prop('hidden', matches.length === 0);
    }
    $search.on('input', renderSearch);
    $search.on('keydown', function (event) {
        if (event.key === 'Escape') $suggestions.prop('hidden', true);
        if (event.key === 'ArrowDown' && !$suggestions.prop('hidden')) {
            event.preventDefault(); $suggestions.find('button').first().trigger('focus');
        }
    });
    $suggestions.on('keydown', 'button', function (event) {
        const $buttons = $suggestions.find('button');
        const index = $buttons.index(this);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            $buttons.eq((index + (event.key === 'ArrowDown' ? 1 : -1) + $buttons.length) % $buttons.length).trigger('focus');
        }
        if (event.key === 'Escape') { $suggestions.prop('hidden', true); $search.trigger('focus'); }
    });
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.jq-search-wrap').length) $suggestions.prop('hidden', true);
    });
    renderSearch();
    const $highlightArea = $('#highlight-area');
    const originalParagraphs = $highlightArea.find('p').map(function () { return $(this).text(); }).get();
    function highlightText() {
        const query = $('#highlight-search').val().trim();
        $highlightArea.find('p').each(function (index) {
            const text = originalParagraphs[index];
            $(this).empty();
            if (!query) { $(this).text(text); return; }
            let cursor = 0;
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();
            let at;
            while ((at = lowerText.indexOf(lowerQuery, cursor)) !== -1) {
                $(this).append(document.createTextNode(text.slice(cursor, at)));
                $('<mark>').text(text.slice(at, at + query.length)).appendTo(this);
                cursor = at + query.length;
            }
            $(this).append(document.createTextNode(text.slice(cursor)));
        });
    }
    $('#highlight-search').on('input', highlightText);
    $('#clear-highlight').on('click', function () { $('#highlight-search').val(''); highlightText(); });

    function updateProgress() {
        const maxScroll = $(document).height() - $(window).height();
        const percent = maxScroll > 0 ? Math.min(100, Math.max(0, $(window).scrollTop() / maxScroll * 100)) : 100;
        $('#scroll-progress').css('width', percent + '%');
    }
    $(window).on('scroll resize', updateProgress);
    updateProgress();

    let countersStarted = false;
    function startCounters() {
        if (countersStarted) return;
        const section = document.getElementById('jquery-stats');
        if (section.getBoundingClientRect().top > window.innerHeight) return;
        countersStarted = true;
        $('.jq-counter').each(function () {
            const $counter = $(this);
            const target = Number($counter.attr('data-target'));
            $({ value: 0 }).animate({ value: target }, {
                duration: 1100,
                step: function (value) { $counter.text(Math.floor(value)); },
                complete: function () { $counter.text(target); }
            });
        });
    }
    $(window).on('scroll resize', startCounters);
    startCounters();

    let toastTimer;
    function showToast(message) {
        const $toast = $('#jq-toast');
        clearTimeout(toastTimer);
        $toast.stop(true, true).text(message).fadeIn(200);
        toastTimer = setTimeout(function () { $toast.fadeOut(450); }, 2600);
    }
    $('#jq-feedback-form').on('submit', function (event) {
        event.preventDefault();
        const $form = $(this);
        if (!$form[0].reportValidity()) return;
        const $button = $('#jq-submit');
        $button.prop('disabled', true).html('<span class="jq-spinner" aria-hidden="true"></span> Please wait…');
        setTimeout(function () {
            $button.prop('disabled', false).text('Submit feedback');
            $form[0].reset();
            showToast('Feedback submitted (ish)');
        }, 1300);
    });
    $('#jq-copy').on('click', async function () {
        const text = $('#jq-copy-text').val();
        try {
            if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(text);
            $('#jq-copy').text('✓ Copied');
            $('#jq-copy-tip').text('Copied to clipboard!');
            showToast('Copied to clipboard!');
            setTimeout(function () { $('#jq-copy').text('Copy'); $('#jq-copy-tip').text(''); }, 2200);
        } catch (error) {
            $('#jq-copy-tip').text('Copy needs HTTPS or localhost. Select the text to copy.');
            $('#jq-copy-text').trigger('focus').trigger('select');
        }
    });
    const lazyImages = document.querySelectorAll('img[data-src]');
    function loadImage(image) {
        $(image).attr('src', $(image).attr('data-src')).removeAttr('data-src');
    }
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { loadImage(entry.target); observer.unobserve(entry.target); }
            });
        }, { rootMargin: '180px' });
        lazyImages.forEach(image => observer.observe(image));
    } else {
        lazyImages.forEach(loadImage);
    }
});
