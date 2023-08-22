if (location.host === "www.instagram.com") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMInstagram);
    } else {
        afterDOMInstagram();
    }
}

var elementoSugestaoTop = 0;

function afterDOMInstagram() {
    console.log('Fone Helper Rodando! - Instagram');

    travarScrollParaBaixo();

    setInterval(() => {

        var photos = document.querySelectorAll('main ._aagu')
        var pathSearch = document.querySelector('path[d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z"]');
        if (pathSearch && photos) {
            for (let i = 0; i < photos.length; i++) {
                if (photos[i]) {
                    photos[i].innerHTML = '';
                }
            }
        }

    }, 100);


    setInterval(() => {
        let element = getSuggestedPosts();
        if (element) {
            elementoSugestaoTop = (element.offsetTop + element.clientHeight) - (window.innerHeight || document.documentElement.clientHeight);
        }

        var reels = document.querySelector('a[href="/reels/"]');
        if (reels) {
            let reelsGranGranFather = reels.parentElement.parentElement.parentElement;
            reelsGranGranFather.parentNode.removeChild(reelsGranGranFather);
        }


        var explore = document.querySelector('a[href="/explore/"]');
        if (explore) {
            let isExplore = explore.querySelector('polygon[points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953"]')

            if (isExplore) {
                let exploreGranGranFather = explore.parentElement.parentElement.parentElement;
                exploreGranGranFather.parentNode.removeChild(exploreGranGranFather);
            }
        }

    }, 1000);


}

function travarScrollParaBaixo() {
    var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener('scroll', function () {
        if (getPastPosts()) {
            return;
        }

        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var pathHome = document.querySelector('path[d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"]');

        if (pathHome && (scrollTop > lastScrollTop) && elementoSuggestedPostsEstaVisivelOuJaPassou()) {// Rolar para baixo

            let element = getSuggestedPosts();
            window.scrollTo({
                top: elementoSugestaoTop + 200,
                left: 0,
                behavior: 'smooth'
            });
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

function getSuggestedPosts() {
    var labels = document.querySelectorAll('main span[dir="auto"]');

    for (let i = 0; i < labels.length; i++) {
        if (labels[i].textContent.startsWith("Suggested Posts")) {
            return labels[i];
        }
    }
}

function getPastPosts() {
    var labels = document.querySelectorAll('span');

    for (let i = 0; i < labels.length; i++) {
        if (labels[i].textContent.startsWith("Past Posts")) {
            return labels[i];
        }
    }
}

function elementoSuggestedPostsEstaVisivelOuJaPassou() {
    let element = getSuggestedPosts();
    if (!element) {
        return true;
    }

    var rect = element.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return (rect.top + 100) <= windowHeight;
}