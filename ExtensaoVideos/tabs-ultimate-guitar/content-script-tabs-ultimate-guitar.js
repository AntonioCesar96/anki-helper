

if (location.host.includes('tabs.ultimate-guitar')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoadedTabsUltimateGuitar);
    } else {
        afterDOMLoadedTabsUltimateGuitar();
    }
}

var tituloPagina = '';
var styleElementTabsUltimateGuitarClub;

function addstyleElementTabsUltimateGuitarClub() {
    if (styleElementTabsUltimateGuitarClub) {
        styleElementTabsUltimateGuitarClub.parentElement.removeChild(styleElementTabsUltimateGuitarClub);
    }

    styleElementTabsUltimateGuitarClub = document.createElement('style');

    styleElementTabsUltimateGuitarClub.innerHTML = ``;

    styleElementTabsUltimateGuitarClub.innerHTML += `pre, .g1nC0.kmZt1 .tK8GG { font-family: Roboto Mono,Courier New,monospace !important; overflow: hidden !important; }`;
    styleElementTabsUltimateGuitarClub.innerHTML += `.isAndroid .fciXY { font-weight: 900 !important; color: #f70 !important; }`; //   padding: 1px 5px !important;
    styleElementTabsUltimateGuitarClub.innerHTML += `#tabView {padding: 20px 7px !important;  }`;
    styleElementTabsUltimateGuitarClub.innerHTML += `.isAndroid .fciXY {background: transparent !important;  }`;
    styleElementTabsUltimateGuitarClub.innerHTML += `.DYt1Y, #controls {display: none !important;  }`;

    styleElementTabsUltimateGuitarClub.innerHTML += `
    #floatButtonWrapper {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 99999999;
    }

    .float-button {
        background-color: rgb(13, 121, 69);
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
        background-color: rgb(13, 121, 69);
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
      }

      .sub-rolagem {
            position: fixed;
            bottom: 20px;
            right: 0;
            left: 0;
            text-align: center;
            width: 60%;
            margin: 0 auto;
        }
      
    `;

    document.head.appendChild(styleElementTabsUltimateGuitarClub);
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

    if (document.querySelector('pre')) {
        document.querySelector('pre').parentElement.prepend(floatButtonWrapper);
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
            
            if(document.querySelector('.Ty_RP .y68er')) {
                document.querySelector('.Ty_RP .y68er').style.lineHeight = document.querySelector('pre').style.lineHeight
            }

            localStorage.setItem("lineHeightTabsUltimateGuitarClub", document.querySelector('pre').style.lineHeight);
        } else if (text === 'E-') {
            document.querySelector('pre').style.lineHeight = Number(document.querySelector('pre').style.lineHeight) - 0.05
            
            if(document.querySelector('.Ty_RP .y68er')) {
                document.querySelector('.Ty_RP .y68er').style.lineHeight = document.querySelector('pre').style.lineHeight
            }

            localStorage.setItem("lineHeightTabsUltimateGuitarClub", document.querySelector('pre').style.lineHeight);
        } else if (text === 'F+') {
            let font = document.querySelector('pre').style.fontSize;
            font = Number(font.replace('px', '')) + 0.5;
            document.querySelector('pre').style.fontSize = font + 'px';

            localStorage.setItem("fontSizeTabsUltimateGuitarClub", document.querySelector('pre').style.fontSize);
        } else if (text === 'F-') {
            let font = document.querySelector('pre').style.fontSize;
            font = Number(font.replace('px', '')) - 0.5;
            document.querySelector('pre').style.fontSize = font + 'px';

            localStorage.setItem("fontSizeTabsUltimateGuitarClub", document.querySelector('pre').style.fontSize);
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

function criarRolagem() {
    var subRolagem = document.createElement("div");
    subRolagem.className = "sub-rolagem";

    const sliderRolagem = document.createElement('input');
    sliderRolagem.type = 'range';
    sliderRolagem.style.display = 'inline-block';
    sliderRolagem.min = 0;
    sliderRolagem.max = rolagemMaxima;
    sliderRolagem.setAttribute('id', 'sliderRolagem');
    sliderRolagem.value = tempoScroll;

    sliderRolagem.style.width = '100%';
    sliderRolagem.style.appearance = 'none';
    sliderRolagem.style.height = '10px';
    sliderRolagem.style.background = '#d3d3d3';
    sliderRolagem.style.outline = 'none';
    sliderRolagem.style.borderRadius = '5px';
    sliderRolagem.style.opacity = '0.7';
    sliderRolagem.style.transition = 'opacity 0.2s';

    sliderRolagem.addEventListener('mouseover', function () {
        sliderRolagem.style.opacity = '1';
    });

    sliderRolagem.addEventListener('mouseout', function () {
        sliderRolagem.style.opacity = '0.7';
    });

    sliderRolagem.addEventListener('input', function () {
        tempoScroll = Number(sliderRolagem.value);

        limparScroll();
        if(tempoScroll != 0) {
            scrollar();
        }
    });

    subRolagem.appendChild(sliderRolagem);

    return subRolagem;
}

function toggleButtons() {
    console.log('1')
    var subButtons = document.querySelector(".sub-buttons");
    var subRolagem = document.querySelector(".sub-rolagem");
    if (!subButtons) {
        subButtons = createSubButtons();
        subRolagem = criarRolagem();
        document.getElementById("floatButtonWrapper").appendChild(subButtons);
        document.getElementById("floatButtonWrapper").appendChild(subRolagem);
    } else {
        subButtons.remove();
        subRolagem.remove();
    }
}


function afterDOMLoadedTabsUltimateGuitar() {
    if (!localStorage.getItem("lineHeightTabsUltimateGuitarClub")) {
        localStorage.setItem("lineHeightTabsUltimateGuitarClub", 1);
    }
    if (!localStorage.getItem("fontSizeTabsUltimateGuitarClub")) {
        localStorage.setItem("fontSizeTabsUltimateGuitarClub", '16px');
    }

    if (!location.href.includes('tabs')) {
        location.href = location.href + '#tabs=false';
        location.reload();
        return;
    }

    console.log("TabsUltimateGuitar Club");

    addstyleElementTabsUltimateGuitarClub();

    adicionarLinkFonteExterna();

    createFloatButtonWrapper();

    setTimeout(() => {
        tituloPagina = document.title;
    }, 500);

    setInterval(() => {

        const elementoEncontrado = encontrarElementoPorTexto('OPEN IN APP');

        if (elementoEncontrado) {
            console.log("Elemento encontrado:", elementoEncontrado);
            console.log("Elemento encontrado:", elementoEncontrado.classList);
        }
    }, 2000);


    setTimeout(() => {

        let lineHeight = Number(localStorage.getItem("lineHeightTabsUltimateGuitarClub"));
        document.querySelector('pre').style.lineHeight = lineHeight;

        let fontSize = localStorage.getItem("fontSizeTabsUltimateGuitarClub");
        document.querySelector('pre').style.fontSize = fontSize;

        mudarTitulo();

        document.addEventListener('keydown', function (e) {

            if (e.keyCode == '220' || e.keyCode == '221') { // ] [
                document.querySelector('pre').style.lineHeight = 1
                localStorage.setItem("lineHeightTabsUltimateGuitarClub", document.querySelector('pre').style.lineHeight);
            }

            if (e.keyCode == '107') { // +
                document.querySelector('pre').style.lineHeight = lineHeight + 0.05
                localStorage.setItem("lineHeightTabsUltimateGuitarClub", document.querySelector('pre').style.lineHeight);
            }

            if (e.keyCode == '109') { // -
                document.querySelector('pre').style.lineHeight = lineHeight - 0.05
                localStorage.setItem("lineHeightTabsUltimateGuitarClub", document.querySelector('pre').style.lineHeight);
            }

            mudarTitulo();
        });

    }, 1000);
}

function mudarTitulo() {
    document.title = document.querySelector('pre').style.fontSize + ' - ' + document.querySelector('pre').style.lineHeight + ' - ' + tituloPagina;
}


function encontrarElementoPorTexto(textoProcurado) {
    const elementos = document.querySelectorAll('*');

    for (let i = 0; i < elementos.length; i++) {
        const elemento = elementos[i];
        if (elemento.textContent.toUpperCase().trim() === textoProcurado) {
            return elemento;
        }
    }

    return null;
}

function adicionarLinkFonteExterna() {
    const linkFonte = document.createElement('link');
    linkFonte.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap';
    linkFonte.rel = 'stylesheet';
    document.head.appendChild(linkFonte);
}

var scrollId;
var tempoScroll = 0;
var rolagemMaxima = 100;
function scrollar() {
    if (scrollId) {
        limparScroll();
        return;
    }

    scrollId = setInterval(() => {
        window.scrollTo(0, window.scrollY + 1)
    }, rolagemMaxima - tempoScroll);
}

function limparScroll() {
    if (scrollId) {
        clearInterval(scrollId);
        scrollId = null;
    }
}