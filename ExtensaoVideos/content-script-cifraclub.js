

if (location.host === "www.cifraclub.com.br") {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedCifra);
    } else {
        afterDOMLoadedCifra();
    }
} else {

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedPronunciation);
    } else {
        afterDOMLoadedPronunciation();
    }

}

var tituloPagina = '';

function afterDOMLoadedCifra() {
    console.log("Cifra Club");

    setTimeout(() => {
        tituloPagina = document.title;
    }, 500);

    setTimeout(() => {
        document.addEventListener('keydown', function (e) {
            let lineHeight = Number(document.querySelector('pre').style.lineHeight);
            if (lineHeight === 0) {
                document.querySelector('pre').style.lineHeight = 1.6;
                lineHeight = Number(document.querySelector('pre').style.lineHeight);
            }

            if (e.keyCode == '220' || e.keyCode == '221') { // ] [
                document.querySelector('pre').style.lineHeight = 1
            }

            if (e.keyCode == '107') { // +
                document.querySelector('pre').style.lineHeight = lineHeight + 0.05
            }

            if (e.keyCode == '109') { // -
                document.querySelector('pre').style.lineHeight = lineHeight - 0.05
            }

            document.title = document.querySelector('pre').style.lineHeight + ' - ' + tituloPagina;
        });
    }, 1000);
}


function afterDOMLoadedPronunciation() {

    console.log("Pronunciation");

    setTimeout(() => {
        document.addEventListener('contextmenu', function (e) {

            let palavraMarcada = window.getSelection()?.toString().trim() ?? "";

            if (e.ctrlKey) {
                e.preventDefault();

                var audio = new Audio(`http://localhost:3000/google/pronunciation?palavra=${palavraMarcada}`);
                audio.play();

            }
        }, true);

        document.addEventListener('keydown', function (e) {

            let palavraMarcada = window.getSelection()?.toString().trim() ?? "";

            if (e.ctrlKey === true && (e.keyCode == '220' || e.keyCode == '221')) { // ] [

                window.open("https://www.google.com/search?q=" + palavraMarcada + "+pronunciation+english");
            }

            if (e.ctrlKey === true && e.keyCode == '194') { // ] [

                window.open("https://context.reverso.net/traducao/ingles-portugues/" + palavraMarcada);
            }

        });
    }, 1000);

}