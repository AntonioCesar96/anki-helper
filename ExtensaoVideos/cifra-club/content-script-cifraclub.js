

if (location.host.includes('cifraclub')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedCifra);
    } else {
        afterDOMLoadedCifra();
    }
}

var tituloPagina = '';
var styleElementCifraClub;

function addstyleElementCifraClub() {
    if (styleElementCifraClub) {
        styleElementCifraClub.parentElement.removeChild(styleElementCifraClub);
    }

    styleElementCifraClub = document.createElement('style');

    styleElementCifraClub.innerHTML = ``;

    styleElementCifraClub.innerHTML += `#pub-cc-cifra, ._3d9EN { display: none !important; }`;
    styleElementCifraClub.innerHTML += `pre div { padding: 0 5px !important; }`;
    styleElementCifraClub.innerHTML += `#pub-cc-footerFixed { display: none !important; }`;
    styleElementCifraClub.innerHTML += `#inScreen, .st-placement, .inScreen { display: none !important; }`;
    styleElementCifraClub.innerHTML += `.st-adunit, .st-adunit-inscreen, .st-reset { display: none !important; }`;
    styleElementCifraClub.innerHTML += `.st-adunit-ad, .st-reset { display: none !important; }`;
    styleElementCifraClub.innerHTML += `.st-display-render, .st-reset, .open, .970x250 { display: none !important; }`;
    styleElementCifraClub.innerHTML += `.st-canvas st-reset, .horizontal-static { display: none !important; }`;
    styleElementCifraClub.innerHTML += `._2AzIn, ._1xtef, .with-refresh { display: none !important; }`;
    styleElementCifraClub.innerHTML += `.pub--outpage { display: none !important; }`;
    styleElementCifraClub.innerHTML += `#pub-cc-customAds_ad_refresh-0, #pub-cc-customAds_ad, #pub-cc-customAds { display: none !important; }`;
    styleElementCifraClub.innerHTML += `
    #floatButtonWrapper {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 99999999;
    }

    .float-button {
        background-color: #007bff;
        color: #fff;
        padding: 14px 15px;
        border-radius: 50%;
        cursor: pointer;
        font-weight: bold;
      }
      
      .sub-buttons {
        position: absolute;
        bottom: 100%;
        right: 0;
      }
      
      .sub-button {
        display: block;
        margin-bottom: 10px;
        padding: 10px 15px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
      }
      
    `;

    document.head.appendChild(styleElementCifraClub);
}

function createFloatButton() {
    var floatButton = document.createElement("div");
    floatButton.id = "floatButton";
    floatButton.className = "float-button";
    floatButton.textContent = "C";
    floatButton.onclick = toggleButtons;

    return floatButton;
}

// Função para criar o wrapper do floatButton
function createFloatButtonWrapper() {
    var floatButtonWrapper = document.createElement("div");
    floatButtonWrapper.id = "floatButtonWrapper";
    floatButtonWrapper.appendChild(createFloatButton());

    if(document.querySelector('._2avdQ')) {
        document.querySelector('._2avdQ').appendChild(floatButtonWrapper);
    } else {
        document.body.appendChild(floatButtonWrapper);
    }
}


function createButton(text) {
    var button = document.createElement("button");
    button.className = "sub-button";
    button.textContent = text;
    button.onclick = function () {
        if (text === 'E+') {
            document.querySelector('pre').style.lineHeight = Number(document.querySelector('pre').style.lineHeight) + 0.05
            localStorage.setItem("lineHeightCifraClub", document.querySelector('pre').style.lineHeight);
        } else if (text === 'E-') {
            document.querySelector('pre').style.lineHeight = Number(document.querySelector('pre').style.lineHeight) - 0.05
            localStorage.setItem("lineHeightCifraClub", document.querySelector('pre').style.lineHeight);
        } else if (text === 'F+') {
            let font = document.querySelector('pre').style.fontSize;
            font = Number(font.replace('px', '')) + 0.5;
            document.querySelector('pre').style.fontSize = font + 'px';

            localStorage.setItem("fontSizeCifraClub", document.querySelector('pre').style.fontSize);
        } else if (text === 'F-') {
            let font = document.querySelector('pre').style.fontSize;
            font = Number(font.replace('px', '')) - 0.5;
            document.querySelector('pre').style.fontSize = font + 'px';

            localStorage.setItem("fontSizeCifraClub", document.querySelector('pre').style.fontSize);
        }

        mudarTitulo();
    };

    return button;
}

function createSubButtons() {
    var subButtons = document.createElement("div");
    subButtons.className = "sub-buttons";

    var button1 = createButton("E+");
    var button2 = createButton("E-");
    var button3 = createButton("F+");
    var button4 = createButton("F-");

    subButtons.appendChild(button1);
    subButtons.appendChild(button2);
    subButtons.appendChild(button3);
    subButtons.appendChild(button4);

    return subButtons;
}

function toggleButtons() {
    console.log('1')
    var subButtons = document.querySelector(".sub-buttons");
    if (!subButtons) {
        subButtons = createSubButtons();
        document.getElementById("floatButtonWrapper").appendChild(subButtons);
    } else {
        subButtons.remove();
    }
}


function afterDOMLoadedCifra() {
    if (!localStorage.getItem("lineHeightCifraClub")) {
        localStorage.setItem("lineHeightCifraClub", 1);
    }
    if (!localStorage.getItem("fontSizeCifraClub")) {
        localStorage.setItem("fontSizeCifraClub", '16px');
    }

    if (!location.href.includes('tabs')) {
        location.href = location.href + '#tabs=false';
        location.reload();
        return;
    }

    console.log("Cifra Club");

    addstyleElementCifraClub();

    createFloatButtonWrapper();

    setTimeout(() => {
        tituloPagina = document.title;
    }, 500);
    

    setTimeout(() => {

        let lineHeight = Number(localStorage.getItem("lineHeightCifraClub"));
        document.querySelector('pre').style.lineHeight = lineHeight;

        let fontSize = localStorage.getItem("fontSizeCifraClub");
        document.querySelector('pre').style.fontSize = fontSize;       
        
        document.querySelector('header.header')?.remove();
        document.querySelector('.bfHeader-wrapper')?.remove();

        mudarTitulo();

        document.addEventListener('keydown', function (e) {

            if (e.keyCode == '220' || e.keyCode == '221') { // ] [
                document.querySelector('pre').style.lineHeight = 1
                localStorage.setItem("lineHeightCifraClub", document.querySelector('pre').style.lineHeight);
            }

            if (e.keyCode == '107') { // +
                document.querySelector('pre').style.lineHeight = lineHeight + 0.05
                localStorage.setItem("lineHeightCifraClub", document.querySelector('pre').style.lineHeight);
            }

            if (e.keyCode == '109') { // -
                document.querySelector('pre').style.lineHeight = lineHeight - 0.05
                localStorage.setItem("lineHeightCifraClub", document.querySelector('pre').style.lineHeight);
            }

            mudarTitulo();
        });
    }, 1000);
}

function mudarTitulo() {
    document.title = document.querySelector('pre').style.fontSize + ' - ' + document.querySelector('pre').style.lineHeight + ' - ' + tituloPagina;
}
