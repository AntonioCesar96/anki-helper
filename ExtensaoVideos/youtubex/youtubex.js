setInterval(() => {
    if (location.host === 'www.youtube.com') {
        document.querySelectorAll('[data-pagelet="IGDChatTabsRootContent"], a[href="/direct/inbox/"]').forEach(function name(el) {
            el.style.filter = 'grayscale(100%)';
        });
    }
}, 1000);