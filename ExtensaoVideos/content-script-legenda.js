var sitesHome = [
    { host: "www.netflix.com", },
    { host: "primevideo" },
    { host: "play.hbomax.com" },
    { host: "www.disneyplus.com" },
    { host: "www.starplus.com" },
    { host: "www.southparkstudios.com.br" },
    { host: "soaper" },
]

var siteHome = sitesHome.filter(x => location.host.includes(x.host))[0];
if (siteHome) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLegenda);
    } else {
        afterDOMLegenda();
    }
}

var lagLegendaRodape = obterVariavel('lagLegendaRodape') ? obterVariavel('lagLegendaRodape') : 1100;
var lagLegendaTopo = obterVariavel('lagLegendaTopo') ? obterVariavel('lagLegendaTopo') : 1100;
var fonteLegendaTopo = obterVariavel('fonteLegendaTopo') ? obterVariavel('fonteLegendaTopo') : 34;
var fonteLegendaRodape = obterVariavel('fonteLegendaRodape') ? obterVariavel('fonteLegendaRodape') : 34;
var posicaoLegendaTopo = obterVariavel('posicaoLegendaTopo') ? obterVariavel('posicaoLegendaTopo') : 2;
var posicaoLegendaRodape = obterVariavel('posicaoLegendaRodape') ? obterVariavel('posicaoLegendaRodape') : 5;
var posicaoLegendaSliderTopo = obterVariavel('posicaoLegendaSliderTopo') ? obterVariavel('posicaoLegendaSliderTopo') : 2;
var posicaoLegendaSliderRodape = obterVariavel('posicaoLegendaSliderRodape') ? obterVariavel('posicaoLegendaSliderRodape') : 10;
var backgroundColorTopo = obterVariavel('backgroundColorTopo') ? obterVariavel('backgroundColorTopo') : '0.25';
var backgroundColorRodape = obterVariavel('backgroundColorRodape') ? obterVariavel('backgroundColorRodape') : '0.25';

var legendaRodapeInterval = 0;
var legendaTopoInterval = 0;
var legendaTopoLigar = false;
var legendaRodapeLigar = false;
var legendaRodape;
var legendaTopo;
var legendas = [];

function obterVariavel(nome) {
    let variavel = localStorage.getItem(nome);
    if (variavel) {
        return Number(variavel);
    }
    return null;
}

function salvarVariavel(nome, valor) {
    localStorage.setItem(nome, valor);
}

function afterDOMLegenda() {
    console.log('Fone Helper Rodando! - Legenda');

    addFontToPage(localStorage.getItem('fontBase64'));

    let intervalCriarModal = setInterval(() => {
        if (document.querySelector('video')) {
            criarModal();
            clearInterval(intervalCriarModal);
        }
    }, 500);

    document.addEventListener('keydown', checkKey);

    async function checkKey(e) {
        e = e || window.event;

        // console.log(e);
        // e.ctrlKey && 
        if (e.code == 'KeyQ') { 
            if (!document.getElementById('modal') && document.querySelector('video')) {
                criarModal();
            }

            if (document.getElementById('modal')) {
                if (document.getElementById('modal').style.display === 'block') {
                    closeModal();
                } else {
                    openModal();
                }
            }
        }

        if (e.code == 'KeyW') { 
            legendaTopoLigar = !legendaTopoLigar;
            document.getElementById('switchLegendaTopoButton').checked = legendaTopoLigar;
        }

        if (e.code == 'KeyE') {
            legendaRodapeLigar = !legendaRodapeLigar;
            document.getElementById('switchLegendaRodapeButton').checked = legendaRodapeLigar;
        }
    }
}

function criarLegendaRodape() {
    let legenda = document.createElement('div');
    legenda.setAttribute('id', 'legendaRodapeHtml');
    legenda.classList.add('legenda');
    legenda.style.position = 'fixed';
    legenda.style.zIndex = '99999999999';
    legenda.style.bottom = posicaoLegendaRodape + '%';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.color = '#fff';
    legenda.style.fontSize = fonteLegendaRodape + 'px';
    legenda.style.fontFamily = 'NovaFonte, sans-serif';
    legenda.style.textAlign = 'center';
    legenda.style.pointerEvents = 'none';
    legenda.innerText = 'Texto da legenda';

    return legenda;
}

function criarLegendaTopo() {
    let legenda = document.createElement('div');
    legenda.setAttribute('id', 'legendaTopoHtml');
    legenda.classList.add('legenda');
    legenda.style.position = 'fixed';
    legenda.style.zIndex = '99999999999';
    legenda.style.top = posicaoLegendaTopo + '%';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.color = '#fff';
    legenda.style.fontSize = fonteLegendaTopo + 'px';
    legenda.style.fontFamily = 'NovaFonte, sans-serif';
    legenda.style.textAlign = 'center';
    legenda.style.pointerEvents = 'none';
    legenda.innerText = 'Texto da legenda';

    return legenda;
}

function parsearArquivoLegenda(legendas) {
    let listaBlocosAux = [];
    let linhas = legendas.split('\r\n');

    let contaLinha = 1;
    let blocoObjeto = { legenda: '', legendas: [] };
    for (let i = 0; i < linhas.length; i++) {
        let linha = linhas[i];

        if (linha != '') {
            if (contaLinha === 2) {
                var splitTempo = linha.split('-->');
                blocoObjeto.inicio = converterParaMilissegundos(splitTempo[0].trim());
                blocoObjeto.fim = converterParaMilissegundos(splitTempo[1].trim());
            }

            if (contaLinha > 2) {
                if (linha.includes('{\\an8}')) {
                    blocoObjeto.superior = true;
                }

                linha = linha.replace('{\\an8}', '');
                blocoObjeto.legendas.push(linha);
                blocoObjeto.legenda += `<div style="padding: 0px 0px 0; line-height: normal;">
                    <span style="background-color: rgba(0, 0, 0, 0.5); padding: 0px 0px 0; margin: 0;">${linha}</span>
                    </div>`;
            }

            contaLinha++;
        }

        if (linha == '' && blocoObjeto.legenda !== '') {
            listaBlocosAux.push(blocoObjeto);
            blocoObjeto = { legenda: '', legendas: [] };
            contaLinha = 1;
        }
    }

    if (blocoObjeto.legenda !== '') {
        listaBlocosAux.push(blocoObjeto);
    }

    return listaBlocosAux;
}

function converterParaMilissegundos(tempo) {
    var partes = tempo.split(':');
    var horas = parseInt(partes[0]);
    var minutos = parseInt(partes[1]);
    var segundos = parseFloat(partes[2].replace(',', '.'));

    var totalMilissegundos = (horas * 3600 + minutos * 60 + segundos) * 1000;

    return totalMilissegundos;
}


function criarModal() {
    if (document.getElementById('modal')) {
        return;
    }

    // Cria o elemento do modal
    var modal = document.createElement('div');
    modal.setAttribute('id', 'modal');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '99999999999';
    modal.style.right = '0';
    modal.style.top = '14%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    // Cria o conteúdo do modal
    var modalContent = document.createElement('div');
    modalContent.setAttribute('id', 'modal-content');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '0 0 0 auto';
    modalContent.style.padding = '10px 20px 13px';
    modalContent.style.paddingTop = '10px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '400px';
    modalContent.style.boxSizing = 'content-box';
    modalContent.style.color = '#000';
    modalContent.style.fontSize = '15px';

    // Cria o botão de fechar
    var closeButton = document.createElement('span');
    closeButton.setAttribute('class', 'close');
    closeButton.innerHTML = '&times;';
    closeButton.style.color = '#aaa';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';

    // Adiciona evento de clique no botão de fechar
    closeButton.addEventListener('click', closeModal);

    // 
    var fontFileInput = document.createElement('input');
    fontFileInput.setAttribute('type', 'file');
    fontFileInput.setAttribute('id', 'fontFileInput');
    fontFileInput.style.fontSize = '13.3px';
    fontFileInput.addEventListener('change', handleFontFile, false);

    fontFileInput.style.display = 'none';

    const buttonFontFileInput = document.createElement('button');
    buttonFontFileInput.innerText = 'Fonte';
    buttonFontFileInput.style.padding = '8px 16px';
    buttonFontFileInput.style.border = 'none';
    buttonFontFileInput.style.backgroundColor = '#007bff';
    buttonFontFileInput.style.color = '#fff';
    buttonFontFileInput.style.fontFamily = 'sans-serif';
    buttonFontFileInput.style.cursor = 'pointer';
    buttonFontFileInput.style.borderRadius = '5px';

    buttonFontFileInput.addEventListener('click', function () {
        fontFileInput.click();
    });

    //
    var inputTopo = document.createElement('input');
    inputTopo.setAttribute('type', 'file');
    inputTopo.setAttribute('id', 'legendaTopo');
    inputTopo.style.fontSize = '13.3px';
    inputTopo.style.display = 'none';

    const buttonInputTopo = document.createElement('button');
    buttonInputTopo.innerText = 'Legenda Superior';
    buttonInputTopo.style.padding = '8px 16px';
    buttonInputTopo.style.border = 'none';
    buttonInputTopo.style.backgroundColor = '#007bff';
    buttonInputTopo.style.color = '#fff';
    buttonInputTopo.style.fontFamily = 'sans-serif';
    buttonInputTopo.style.cursor = 'pointer';
    buttonInputTopo.style.borderRadius = '5px';
    buttonInputTopo.style.marginTop = '5px';

    buttonInputTopo.addEventListener('click', function () {
        inputTopo.click();
    });

    var inputRodape = document.createElement('input');
    inputRodape.setAttribute('type', 'file');
    inputRodape.setAttribute('id', 'legendaRodape');
    inputRodape.style.fontSize = '13.3px';
    inputRodape.style.display = 'none';

    const buttonInputRodape = document.createElement('button');
    buttonInputRodape.innerText = 'Legenda Inferior';
    buttonInputRodape.style.padding = '8px 16px';
    buttonInputRodape.style.border = 'none';
    buttonInputRodape.style.backgroundColor = '#28a745';
    buttonInputRodape.style.color = '#fff';
    buttonInputRodape.style.fontFamily = 'sans-serif';
    buttonInputRodape.style.cursor = 'pointer';
    buttonInputRodape.style.borderRadius = '5px';
    buttonInputRodape.style.marginTop = '5px';

    buttonInputRodape.addEventListener('click', function () {
        inputRodape.click();
    });


    var buttonRemoverFonte = document.createElement('button');
    buttonRemoverFonte.setAttribute('id', 'buttonRemoverFonte');
    buttonRemoverFonte.innerText = 'Remover fonte';
    buttonRemoverFonte.style.padding = '8px 16px';
    buttonRemoverFonte.style.border = 'none';
    buttonRemoverFonte.style.backgroundColor = '#28a745';
    buttonRemoverFonte.style.color = '#fff';
    buttonRemoverFonte.style.fontFamily = 'sans-serif';
    buttonRemoverFonte.style.cursor = 'pointer';
    buttonRemoverFonte.style.borderRadius = '5px';
    buttonRemoverFonte.style.marginLeft = '10px';

    buttonRemoverFonte.addEventListener('click', function () {
        localStorage.removeItem('fontBase64');

        while (getFontByName('NovaFonte')) {
            let novaFonte = getFontByName('NovaFonte');
            document.fonts.delete(novaFonte);
        }

        function getFontByName(fontName) {
            for (const font of document.fonts.entries()) {
                if (font[1].family === fontName) {
                    return font[1];
                }
            }
            return null;
        }
    });

    // Adiciona os elementos ao modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(inputTopo);
    modalContent.appendChild(buttonInputTopo);

    addInputsTopo(modalContent);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(inputRodape);
    modalContent.appendChild(buttonInputRodape);

    addInputsRodape(modalContent);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(fontFileInput);
    modalContent.appendChild(buttonFontFileInput);

    modalContent.appendChild(buttonRemoverFonte);

    modal.appendChild(modalContent);

    // Adiciona o modal ao body
    if (location.host.includes("netflix")) {
        document.querySelector('video').parentElement
            .parentElement.parentElement.parentElement.appendChild(modal);
    } else {
        document.querySelector('video').parentElement.parentElement.appendChild(modal);
    }

    // Topo
    inputTopo.addEventListener('change', (event) => {
        const files = event.target.files;
        let file = files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const contents = e.target.result;

            let legendas = parsearArquivoLegenda(contents);

            if (legendas.some(x => x.superior)) {
                tratarLegendaDupla(legendas);
                return;
            }

            tratarLegendaTopo(legendas);
        };
        reader.readAsText(file);
    });

    // Rodape
    inputRodape.addEventListener('change', (event) => {
        const files = event.target.files;
        let file = files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const contents = e.target.result;

            let legendas = parsearArquivoLegenda(contents);

            if (legendas.some(x => x.superior)) {
                tratarLegendaDupla(legendas);
                return;
            }

            tratarLegendaRodape(legendas);
        };
        reader.readAsText(file);
    });
}

function tratarLegendaDupla(legendas) {
    let legendaSuperior = legendas.filter(x => x.superior);
    let legendaInferior = legendas.filter(x => !x.superior);

    tratarLegendaTopo(legendaSuperior);
    tratarLegendaRodape(legendaInferior);
}

function tratarLegendaTopo(legendas) {
    if (!document.getElementById('legendaTopoHtml')) {
        legendaTopoHtml = criarLegendaTopo();

        if (document.querySelector('video')) {
            document.querySelector('video').parentElement.appendChild(legendaTopoHtml);
        } else {
            document.body.appendChild(legendaTopoHtml);
        }
    }

    document.getElementById('switchLegendaTopoButton').checked = true;
    legendaTopoLigar = true;

    clearInterval(legendaTopoInterval);
    legendaTopoInterval = setInterval(() => {

        const video = document.querySelector('video');
        if (!video) {
            return;
        }

        if (!legendaTopoLigar) {
            legendaTopoHtml.innerHTML = '';
            legendaTopoHtml.style.display = 'none';
            return;
        }

        const currentTime = (video.currentTime * 1000) + lagLegendaTopo;
        const subtitle = legendas.find(sub => currentTime >= sub.inicio && currentTime <= sub.fim);

        if (subtitle) {
            let innerHTML = "";
            for (let i = 0; i < subtitle.legendas.length; i++) {
                innerHTML += `<div style="padding: 0px 0px 0; line-height: normal;">
                <span style="background-color: rgba(0, 0, 0, ${backgroundColorTopo}); padding: 0px 0px 0; margin: 0;">${subtitle.legendas[i]}</span>
                </div>`;
            }

            if (legendaTopoHtml.innerHTML != innerHTML) {
                legendaTopoHtml.innerHTML = innerHTML;
                legendaTopoHtml.style.display = 'block';
            }

            legendaTopoHtml.style.top = obterVariacaoSeSliderVisivelTopo() + '%';
        } else {
            legendaTopoHtml.innerHTML = '';
            legendaTopoHtml.style.display = 'none';
        }

    }, 10);
}

function tratarLegendaRodape(legendas) {
    if (!document.getElementById('legendaRodapeHtml')) {
        legendaRodapeHtml = criarLegendaRodape();

        if (document.querySelector('video')) {
            document.querySelector('video').parentElement.appendChild(legendaRodapeHtml);
        } else {
            document.body.appendChild(legendaRodapeHtml);
        }
    }

    document.getElementById('switchLegendaRodapeButton').checked = true;
    legendaRodapeLigar = true;

    clearInterval(legendaRodapeInterval);
    legendaRodapeInterval = setInterval(() => {
        const video = document.querySelector('video');
        if (!video) {
            return;
        }

        if (!legendaRodapeLigar) {
            legendaRodapeHtml.innerHTML = '';
            legendaRodapeHtml.style.display = 'none';
            return;
        }

        const currentTime = (video.currentTime * 1000) + lagLegendaRodape;
        const subtitle = legendas.find(sub => currentTime >= sub.inicio && currentTime <= sub.fim);

        if (subtitle) {
            let innerHTML = "";
            for (let i = 0; i < subtitle.legendas.length; i++) {
                innerHTML += `<div style="padding: 0px 0px 0; line-height: normal;">
                            <span style="background-color: rgba(0, 0, 0, ${backgroundColorRodape}); padding: 0px 0px 0; margin: 0;">${subtitle.legendas[i]}</span>
                            </div>`;
            }

            if (legendaRodapeHtml.innerHTML != innerHTML) {
                legendaRodapeHtml.innerHTML = innerHTML;
                legendaRodapeHtml.style.display = 'block';
            }

            legendaRodapeHtml.style.bottom = obterVariacaoSeSliderVisivelRodape() + '%';
        } else {
            legendaRodapeHtml.innerHTML = '';
            legendaRodapeHtml.style.display = 'none';
        }

    }, 10);
}

function obterVariacaoSeSliderVisivelRodape() {
    if ((document.querySelector('div[data-testid="TimelineSlider"]') ||
        document.querySelector('.atvwebplayersdk-seekbar-container.show') ||
        document.querySelector('.overlay__controls--visually-show') ||
        document.querySelector('div[data-uia="timeline-bar"]') ||
        document.querySelector('div[id="player"]:not(.jw-flag-user-inactive)'))
        // && posicaoLegendaRodape < posicaoLegendaSliderRodape
    ) {
        return posicaoLegendaSliderRodape;
    }


    return posicaoLegendaRodape;

}

function obterVariacaoSeSliderVisivelTopo() {
    if ((document.querySelector('div[data-testid="TimelineSlider"]') ||
        document.querySelector('.atvwebplayersdk-seekbar-container.show') ||
        document.querySelector('.overlay__controls--visually-show') ||
        document.querySelector('div[data-uia="timeline-bar"]') ||
        document.querySelector('div[id="player"]:not(.jw-flag-user-inactive)'))
        // && posicaoLegendaTopo < posicaoLegendaSliderTopo
    ) {
        return posicaoLegendaSliderTopo;
    }


    return posicaoLegendaTopo;

}

function openModal() {
    document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function addInputsTopo(modalContent) {

    // Cria o botão switch TOPO
    var switchLegendaTopoButton = document.createElement('label');
    switchLegendaTopoButton.setAttribute('class', 'switch');
    switchLegendaTopoButton.setAttribute('for', 'switchLegendaTopoButton');
    switchLegendaTopoButton.style.display = 'inline-block';
    switchLegendaTopoButton.style.margin = '8px 5px 10px 10px';

    var switchLegendaTopo = document.createElement('input');
    switchLegendaTopo.setAttribute('type', 'checkbox');
    switchLegendaTopo.setAttribute('id', 'switchLegendaTopoButton');
    switchLegendaTopo.style.margin = '0';

    var spanSwitchLegendaTopo = document.createElement('span');
    spanSwitchLegendaTopo.textContent = 'Desligar Legenda Superior';
    spanSwitchLegendaTopo.style.verticalAlign = 'text-bottom';
    spanSwitchLegendaTopo.style.marginLeft = '3px';
    
    switchLegendaTopoButton.appendChild(switchLegendaTopo);
    switchLegendaTopoButton.appendChild(spanSwitchLegendaTopo);

    // Adiciona o ouvinte de evento ao checkbox
    switchLegendaTopo.addEventListener('change', function () {
        legendaTopoLigar = this.checked
    });

    // INPUTS Lag topo
    var lagTopoLabel = document.createElement('label');
    lagTopoLabel.setAttribute('for', 'lagTopo');
    lagTopoLabel.innerHTML = 'Lag Legenda Superior';
    lagTopoLabel.style.display = 'inline-block';
    lagTopoLabel.style.marginRight = '5px';
    lagTopoLabel.style.marginTop = '10px';

    var lagTopoInput = document.createElement('input');
    lagTopoInput.setAttribute('type', 'number');
    lagTopoInput.setAttribute('id', 'lagTopo');
    lagTopoInput.value = lagLegendaTopo;
    lagTopoInput.style.display = 'inline-block';
    lagTopoInput.style.width = '100px';
    lagTopoInput.style.height = '18px';

    lagTopoInput.addEventListener('input', function () {
        lagLegendaTopo = Number(this.value);
        salvarVariavel('lagLegendaTopo', lagLegendaTopo);
    });

    // Fonte Superior
    var fonteTopoLabel = document.createElement('label');
    fonteTopoLabel.setAttribute('for', 'fonteTopo');
    fonteTopoLabel.innerHTML = 'Fonte Superior';
    fonteTopoLabel.style.display = 'inline-block';
    fonteTopoLabel.style.marginRight = '5px';

    const sliderFonteTopoInput = document.createElement('input');
    sliderFonteTopoInput.type = 'range';
    sliderFonteTopoInput.style.display = 'inline-block';
    sliderFonteTopoInput.min = 0;
    sliderFonteTopoInput.max = 60;
    sliderFonteTopoInput.setAttribute('id', 'fonteTopo');
    sliderFonteTopoInput.value = fonteLegendaTopo;

    sliderFonteTopoInput.style.width = '200px';
    sliderFonteTopoInput.style.appearance = 'none';
    sliderFonteTopoInput.style.height = '10px';
    sliderFonteTopoInput.style.background = '#d3d3d3';
    sliderFonteTopoInput.style.outline = 'none';
    sliderFonteTopoInput.style.borderRadius = '5px';
    sliderFonteTopoInput.style.opacity = '0.7';
    sliderFonteTopoInput.style.transition = 'opacity 0.2s';

    const valueDisplaySliderFonteTopoInput = document.createElement('span');
    valueDisplaySliderFonteTopoInput.style.marginLeft = '10px';
    valueDisplaySliderFonteTopoInput.textContent = sliderFonteTopoInput.value;

    sliderFonteTopoInput.addEventListener('mouseover', function () {
        sliderFonteTopoInput.style.opacity = '1';
    });

    sliderFonteTopoInput.addEventListener('mouseout', function () {
        sliderFonteTopoInput.style.opacity = '0.7';
    });

    sliderFonteTopoInput.addEventListener('input', function () {
        valueDisplaySliderFonteTopoInput.textContent = sliderFonteTopoInput.value;
        fonteLegendaTopo = Number(sliderFonteTopoInput.value);
        salvarVariavel('fonteLegendaTopo', fonteLegendaTopo);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        if (legendaTopoHtml) {
            legendaTopoHtml.style.fontSize = fonteLegendaTopo + 'px';
        }
    });
    // FIM Fonte Superior

    // Posição Superior 1
    var posicaoTopoLabel = document.createElement('label');
    posicaoTopoLabel.setAttribute('for', 'posicaoTopo');
    posicaoTopoLabel.innerHTML = 'Posição Superior 1';
    posicaoTopoLabel.style.display = 'inline-block';
    posicaoTopoLabel.style.marginRight = '5px';

    const sliderPosicaoTopoInput = document.createElement('input');
    sliderPosicaoTopoInput.type = 'range';
    sliderPosicaoTopoInput.style.display = 'inline-block';
    sliderPosicaoTopoInput.min = -5;
    sliderPosicaoTopoInput.max = 100;
    sliderPosicaoTopoInput.setAttribute('id', 'posicaoTopo');
    sliderPosicaoTopoInput.value = posicaoLegendaTopo;

    sliderPosicaoTopoInput.style.width = '200px';
    sliderPosicaoTopoInput.style.appearance = 'none';
    sliderPosicaoTopoInput.style.height = '10px';
    sliderPosicaoTopoInput.style.background = '#d3d3d3';
    sliderPosicaoTopoInput.style.outline = 'none';
    sliderPosicaoTopoInput.style.borderRadius = '5px';
    sliderPosicaoTopoInput.style.opacity = '0.7';
    sliderPosicaoTopoInput.style.transition = 'opacity 0.2s';

    const valueDisplaySliderPosicaoTopoInput = document.createElement('span');
    valueDisplaySliderPosicaoTopoInput.style.marginLeft = '10px';
    valueDisplaySliderPosicaoTopoInput.textContent = sliderPosicaoTopoInput.value;

    sliderPosicaoTopoInput.addEventListener('mouseover', function () {
        sliderPosicaoTopoInput.style.opacity = '1';
    });

    sliderPosicaoTopoInput.addEventListener('mouseout', function () {
        sliderPosicaoTopoInput.style.opacity = '0.7';
    });

    sliderPosicaoTopoInput.addEventListener('input', function () {
        valueDisplaySliderPosicaoTopoInput.textContent = sliderPosicaoTopoInput.value;
        posicaoLegendaTopo = Number(sliderPosicaoTopoInput.value);
        salvarVariavel('posicaoLegendaTopo', posicaoLegendaTopo);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        if (legendaTopoHtml) {
            legendaTopoHtml.style.bottom = posicaoLegendaTopo + '%';
        }
    });
    // FIM Posição Superior 1

    // Posição Superior 2
    var posicaoTopoSliderLabel = document.createElement('label');
    posicaoTopoSliderLabel.setAttribute('for', 'posicaoSliderTopo');
    posicaoTopoSliderLabel.innerHTML = 'Posição Superior 2';
    posicaoTopoSliderLabel.style.display = 'inline-block';
    posicaoTopoSliderLabel.style.marginRight = '5px';

    const sliderPosicaoTopoSliderLabel = document.createElement('input');
    sliderPosicaoTopoSliderLabel.type = 'range';
    sliderPosicaoTopoSliderLabel.style.display = 'inline-block';
    sliderPosicaoTopoSliderLabel.min = -5;
    sliderPosicaoTopoSliderLabel.max = 100;
    sliderPosicaoTopoSliderLabel.setAttribute('id', 'posicaoSliderTopo');
    sliderPosicaoTopoSliderLabel.value = posicaoLegendaSliderTopo;

    sliderPosicaoTopoSliderLabel.style.width = '200px';
    sliderPosicaoTopoSliderLabel.style.appearance = 'none';
    sliderPosicaoTopoSliderLabel.style.height = '10px';
    sliderPosicaoTopoSliderLabel.style.background = '#d3d3d3';
    sliderPosicaoTopoSliderLabel.style.outline = 'none';
    sliderPosicaoTopoSliderLabel.style.borderRadius = '5px';
    sliderPosicaoTopoSliderLabel.style.opacity = '0.7';
    sliderPosicaoTopoSliderLabel.style.transition = 'opacity 0.2s';

    const valueDisplaySliderPosicaoTopoSliderLabel = document.createElement('span');
    valueDisplaySliderPosicaoTopoSliderLabel.style.marginLeft = '10px';
    valueDisplaySliderPosicaoTopoSliderLabel.textContent = sliderPosicaoTopoSliderLabel.value;

    sliderPosicaoTopoSliderLabel.addEventListener('mouseover', function () {
        sliderPosicaoTopoSliderLabel.style.opacity = '1';
    });

    sliderPosicaoTopoSliderLabel.addEventListener('mouseout', function () {
        sliderPosicaoTopoSliderLabel.style.opacity = '0.7';
    });

    sliderPosicaoTopoSliderLabel.addEventListener('input', function () {
        valueDisplaySliderPosicaoTopoSliderLabel.textContent = sliderPosicaoTopoSliderLabel.value;
        posicaoLegendaSliderTopo = Number(sliderPosicaoTopoSliderLabel.value);
        salvarVariavel('posicaoLegendaSliderTopo', posicaoLegendaSliderTopo);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        if (legendaTopoHtml) {
            legendaTopoHtml.style.bottom = posicaoLegendaSliderTopo + '%';
        }
    });
    // FIM Posição Superior 2

    // Fundo Cor Superior
    var backgroundColorTopoLabel = document.createElement('label');
    backgroundColorTopoLabel.setAttribute('for', 'backgroundColorTopo');
    backgroundColorTopoLabel.innerHTML = 'Fundo Cor Superior';
    backgroundColorTopoLabel.style.display = 'inline-block';
    backgroundColorTopoLabel.style.marginRight = '5px';

    const sliderBackgroundColorTopoInput = document.createElement('input');
    sliderBackgroundColorTopoInput.type = 'range';
    sliderBackgroundColorTopoInput.style.display = 'inline-block';
    sliderBackgroundColorTopoInput.min = 0.0;
    sliderBackgroundColorTopoInput.max = 1.0;
    sliderBackgroundColorTopoInput.step = 0.05;
    sliderBackgroundColorTopoInput.setAttribute('id', 'backgroundColorTopo');
    sliderBackgroundColorTopoInput.value = backgroundColorTopo;

    sliderBackgroundColorTopoInput.style.width = '200px';
    sliderBackgroundColorTopoInput.style.appearance = 'none';
    sliderBackgroundColorTopoInput.style.height = '10px';
    sliderBackgroundColorTopoInput.style.background = '#d3d3d3';
    sliderBackgroundColorTopoInput.style.outline = 'none';
    sliderBackgroundColorTopoInput.style.borderRadius = '5px';
    sliderBackgroundColorTopoInput.style.opacity = '0.7';
    sliderBackgroundColorTopoInput.style.transition = 'opacity 0.2s';

    const valueDisplaySliderBackgroundColorTopoInput = document.createElement('span');
    valueDisplaySliderBackgroundColorTopoInput.style.marginLeft = '10px';
    valueDisplaySliderBackgroundColorTopoInput.textContent = sliderBackgroundColorTopoInput.value;

    sliderBackgroundColorTopoInput.addEventListener('mouseover', function () {
        sliderBackgroundColorTopoInput.style.opacity = '1';
    });

    sliderBackgroundColorTopoInput.addEventListener('mouseout', function () {
        sliderBackgroundColorTopoInput.style.opacity = '0.7';
    });

    sliderBackgroundColorTopoInput.addEventListener('input', function () {
        valueDisplaySliderBackgroundColorTopoInput.textContent = sliderBackgroundColorTopoInput.value;
        backgroundColorTopo = Number(sliderBackgroundColorTopoInput.value);
        salvarVariavel('backgroundColorTopo', backgroundColorTopo);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        let spans = legendaTopoHtml?.querySelectorAll('span');
        if (legendaTopoHtml && spans) {
            for (let i = 0; i < spans.length; i++) {
                spans[i].style.backgroundColor = `rgba(0, 0, 0, ${backgroundColorTopo})`;
            }
        }
    });
    // FIM Fundo Cor Superior

    modalContent.appendChild(switchLegendaTopoButton);
    modalContent.appendChild(lagTopoLabel);
    modalContent.appendChild(lagTopoInput);
    modalContent.appendChild(document.createElement('br'));

    modalContent.appendChild(fonteTopoLabel);
    modalContent.appendChild(sliderFonteTopoInput);
    modalContent.appendChild(valueDisplaySliderFonteTopoInput);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoTopoLabel);
    modalContent.appendChild(sliderPosicaoTopoInput);
    modalContent.appendChild(valueDisplaySliderPosicaoTopoInput);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoTopoSliderLabel);
    modalContent.appendChild(sliderPosicaoTopoSliderLabel);
    modalContent.appendChild(valueDisplaySliderPosicaoTopoSliderLabel);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(backgroundColorTopoLabel);
    modalContent.appendChild(sliderBackgroundColorTopoInput);
    modalContent.appendChild(valueDisplaySliderBackgroundColorTopoInput);
}


function addInputsRodape(modalContent) {

    // Cria o botão switch Rodape
    var switchLegendaRodapeButton = document.createElement('label');
    switchLegendaRodapeButton.setAttribute('class', 'switch');
    switchLegendaRodapeButton.setAttribute('for', 'switchLegendaRodapeButton');
    switchLegendaRodapeButton.style.display = 'inline-block';
    switchLegendaRodapeButton.style.margin = '8px 5px 10px 10px';

    var switchLegendaRodape = document.createElement('input');
    switchLegendaRodape.setAttribute('type', 'checkbox');
    switchLegendaRodape.setAttribute('id', 'switchLegendaRodapeButton');
    switchLegendaRodape.style.margin = '0';

    var spanSwitchLegendaRodape = document.createElement('span');
    spanSwitchLegendaRodape.textContent = 'Desligar Legenda Inferior';
    spanSwitchLegendaRodape.style.verticalAlign = 'text-bottom';
    spanSwitchLegendaRodape.style.marginLeft = '3px';

    switchLegendaRodapeButton.appendChild(switchLegendaRodape);
    switchLegendaRodapeButton.appendChild(spanSwitchLegendaRodape);

    // Adiciona o ouvinte de evento ao checkbox
    switchLegendaRodape.addEventListener('change', function () {
        legendaRodapeLigar = this.checked;
    });

    // INPUTS Lag Rodape
    var lagRodapeLabel = document.createElement('label');
    lagRodapeLabel.setAttribute('for', 'lagRodape');
    lagRodapeLabel.innerHTML = 'Lag Legenda Inferior';
    lagRodapeLabel.style.display = 'inline-block';
    lagRodapeLabel.style.marginRight = '5px';
    lagRodapeLabel.style.marginTop = '10px';

    var lagRodapeInput = document.createElement('input');
    lagRodapeInput.setAttribute('type', 'number');
    lagRodapeInput.setAttribute('id', 'lagRodape');
    lagRodapeInput.value = lagLegendaRodape;
    lagRodapeInput.style.display = 'inline-block';
    lagRodapeInput.style.width = '100px';

    lagRodapeInput.addEventListener('input', function () {
        lagLegendaRodape = Number(this.value);
        salvarVariavel('lagLegendaRodape', lagLegendaRodape);
    });

    // Fonte Inferior
    var fonteRodapeLabel = document.createElement('label');
    fonteRodapeLabel.setAttribute('for', 'fonteRodape');
    fonteRodapeLabel.innerHTML = 'Fonte Inferior';
    fonteRodapeLabel.style.display = 'inline-block';
    fonteRodapeLabel.style.marginRight = '5px';

    const sliderFonteRodapeInput = document.createElement('input');
    sliderFonteRodapeInput.type = 'range';
    sliderFonteRodapeInput.style.display = 'inline-block';
    sliderFonteRodapeInput.min = 0;
    sliderFonteRodapeInput.max = 60;
    sliderFonteRodapeInput.setAttribute('id', 'fonteRodape');
    sliderFonteRodapeInput.value = fonteLegendaRodape;

    sliderFonteRodapeInput.style.width = '200px';
    sliderFonteRodapeInput.style.appearance = 'none';
    sliderFonteRodapeInput.style.height = '10px';
    sliderFonteRodapeInput.style.background = '#d3d3d3';
    sliderFonteRodapeInput.style.outline = 'none';
    sliderFonteRodapeInput.style.borderRadius = '5px';
    sliderFonteRodapeInput.style.opacity = '0.7';
    sliderFonteRodapeInput.style.transition = 'opacity 0.2s';

    const valueDisplaySliderFonteRodapeInput = document.createElement('span');
    valueDisplaySliderFonteRodapeInput.style.marginLeft = '10px';
    valueDisplaySliderFonteRodapeInput.textContent = sliderFonteRodapeInput.value;

    sliderFonteRodapeInput.addEventListener('mouseover', function () {
        sliderFonteRodapeInput.style.opacity = '1';
    });

    sliderFonteRodapeInput.addEventListener('mouseout', function () {
        sliderFonteRodapeInput.style.opacity = '0.7';
    });

    sliderFonteRodapeInput.addEventListener('input', function () {
        valueDisplaySliderFonteRodapeInput.textContent = sliderFonteRodapeInput.value;
        fonteLegendaRodape = Number(sliderFonteRodapeInput.value);
        salvarVariavel('fonteLegendaRodape', fonteLegendaRodape);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        if (legendaRodapeHtml) {
            legendaRodapeHtml.style.fontSize = fonteLegendaRodape + 'px';
        }
    });
    // FIM Fonte Inferior

    // Posição Inferior 1
    var posicaoRodapeLabel = document.createElement('label');
    posicaoRodapeLabel.setAttribute('for', 'posicaoRodape');
    posicaoRodapeLabel.innerHTML = 'Posição Inferior 1';
    posicaoRodapeLabel.style.display = 'inline-block';
    posicaoRodapeLabel.style.marginRight = '5px';

    const sliderPosicaoRodapeInput = document.createElement('input');
    sliderPosicaoRodapeInput.type = 'range';
    sliderPosicaoRodapeInput.style.display = 'inline-block';
    sliderPosicaoRodapeInput.min = -5;
    sliderPosicaoRodapeInput.max = 100;
    sliderPosicaoRodapeInput.setAttribute('id', 'posicaoRodape');
    sliderPosicaoRodapeInput.value = posicaoLegendaRodape;

    sliderPosicaoRodapeInput.style.width = '200px';
    sliderPosicaoRodapeInput.style.appearance = 'none';
    sliderPosicaoRodapeInput.style.height = '10px';
    sliderPosicaoRodapeInput.style.background = '#d3d3d3';
    sliderPosicaoRodapeInput.style.outline = 'none';
    sliderPosicaoRodapeInput.style.borderRadius = '5px';
    sliderPosicaoRodapeInput.style.opacity = '0.7';
    sliderPosicaoRodapeInput.style.transition = 'opacity 0.2s';

    const valueDisplaySliderPosicaoRodapeInput = document.createElement('span');
    valueDisplaySliderPosicaoRodapeInput.style.marginLeft = '10px';
    valueDisplaySliderPosicaoRodapeInput.textContent = sliderPosicaoRodapeInput.value;

    sliderPosicaoRodapeInput.addEventListener('mouseover', function () {
        sliderPosicaoRodapeInput.style.opacity = '1';
    });

    sliderPosicaoRodapeInput.addEventListener('mouseout', function () {
        sliderPosicaoRodapeInput.style.opacity = '0.7';
    });

    sliderPosicaoRodapeInput.addEventListener('input', function () {
        valueDisplaySliderPosicaoRodapeInput.textContent = sliderPosicaoRodapeInput.value;
        posicaoLegendaRodape = Number(sliderPosicaoRodapeInput.value);
        salvarVariavel('posicaoLegendaRodape', posicaoLegendaRodape);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        if (legendaRodapeHtml) {
            legendaRodapeHtml.style.bottom = posicaoLegendaRodape + '%';
        }
    });
    // FIM Posição Inferior 1

    // Posição Inferior 2
    var posicaoRodapeSliderLabel = document.createElement('label');
    posicaoRodapeSliderLabel.setAttribute('for', 'posicaoSliderRodape');
    posicaoRodapeSliderLabel.innerHTML = 'Posição Inferior 2';
    posicaoRodapeSliderLabel.style.display = 'inline-block';
    posicaoRodapeSliderLabel.style.marginRight = '5px';

    const sliderPosicaoRodapeSliderLabel = document.createElement('input');
    sliderPosicaoRodapeSliderLabel.type = 'range';
    sliderPosicaoRodapeSliderLabel.style.display = 'inline-block';
    sliderPosicaoRodapeSliderLabel.min = -5;
    sliderPosicaoRodapeSliderLabel.max = 100;
    sliderPosicaoRodapeSliderLabel.setAttribute('id', 'posicaoSliderRodape');
    sliderPosicaoRodapeSliderLabel.value = posicaoLegendaSliderRodape;

    sliderPosicaoRodapeSliderLabel.style.width = '200px';
    sliderPosicaoRodapeSliderLabel.style.appearance = 'none';
    sliderPosicaoRodapeSliderLabel.style.height = '10px';
    sliderPosicaoRodapeSliderLabel.style.background = '#d3d3d3';
    sliderPosicaoRodapeSliderLabel.style.outline = 'none';
    sliderPosicaoRodapeSliderLabel.style.borderRadius = '5px';
    sliderPosicaoRodapeSliderLabel.style.opacity = '0.7';
    sliderPosicaoRodapeSliderLabel.style.transition = 'opacity 0.2s';

    const valueDisplaySliderPosicaoRodapeSliderLabel = document.createElement('span');
    valueDisplaySliderPosicaoRodapeSliderLabel.style.marginLeft = '10px';
    valueDisplaySliderPosicaoRodapeSliderLabel.textContent = sliderPosicaoRodapeSliderLabel.value;

    sliderPosicaoRodapeSliderLabel.addEventListener('mouseover', function () {
        sliderPosicaoRodapeSliderLabel.style.opacity = '1';
    });

    sliderPosicaoRodapeSliderLabel.addEventListener('mouseout', function () {
        sliderPosicaoRodapeSliderLabel.style.opacity = '0.7';
    });

    sliderPosicaoRodapeSliderLabel.addEventListener('input', function () {
        valueDisplaySliderPosicaoRodapeSliderLabel.textContent = sliderPosicaoRodapeSliderLabel.value;
        posicaoLegendaSliderRodape = Number(sliderPosicaoRodapeSliderLabel.value);
        salvarVariavel('posicaoLegendaSliderRodape', posicaoLegendaSliderRodape);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        if (legendaRodapeHtml) {
            legendaRodapeHtml.style.bottom = posicaoLegendaSliderRodape + '%';
        }
    });
    // FIM Posição Inferior 2

    // Fundo Cor Inferior
    var backgroundColorRodapeLabel = document.createElement('label');
    backgroundColorRodapeLabel.setAttribute('for', 'backgroundColorRodape');
    backgroundColorRodapeLabel.innerHTML = 'Fundo Cor Inferior';
    backgroundColorRodapeLabel.style.display = 'inline-block';
    backgroundColorRodapeLabel.style.marginRight = '5px';

    const sliderBackgroundColorRodapeInput = document.createElement('input');
    sliderBackgroundColorRodapeInput.type = 'range';
    sliderBackgroundColorRodapeInput.style.display = 'inline-block';
    sliderBackgroundColorRodapeInput.min = 0.0;
    sliderBackgroundColorRodapeInput.max = 1.0;
    sliderBackgroundColorRodapeInput.step = 0.05;
    sliderBackgroundColorRodapeInput.setAttribute('id', 'backgroundColorRodape');
    sliderBackgroundColorRodapeInput.value = backgroundColorRodape;

    sliderBackgroundColorRodapeInput.style.width = '200px';
    sliderBackgroundColorRodapeInput.style.appearance = 'none';
    sliderBackgroundColorRodapeInput.style.height = '10px';
    sliderBackgroundColorRodapeInput.style.background = '#d3d3d3';
    sliderBackgroundColorRodapeInput.style.outline = 'none';
    sliderBackgroundColorRodapeInput.style.borderRadius = '5px';
    sliderBackgroundColorRodapeInput.style.opacity = '0.7';
    sliderBackgroundColorRodapeInput.style.transition = 'opacity 0.2s';

    const valueDisplaySliderBackgroundColorRodapeInput = document.createElement('span');
    valueDisplaySliderBackgroundColorRodapeInput.style.marginLeft = '10px';
    valueDisplaySliderBackgroundColorRodapeInput.textContent = sliderBackgroundColorRodapeInput.value;

    sliderBackgroundColorRodapeInput.addEventListener('mouseover', function () {
        sliderBackgroundColorRodapeInput.style.opacity = '1';
    });

    sliderBackgroundColorRodapeInput.addEventListener('mouseout', function () {
        sliderBackgroundColorRodapeInput.style.opacity = '0.7';
    });

    sliderBackgroundColorRodapeInput.addEventListener('input', function () {
        valueDisplaySliderBackgroundColorRodapeInput.textContent = sliderBackgroundColorRodapeInput.value;
        backgroundColorRodape = Number(sliderBackgroundColorRodapeInput.value);
        salvarVariavel('backgroundColorRodape', backgroundColorRodape);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        let spans = legendaRodapeHtml?.querySelectorAll('span');
        if (legendaRodapeHtml && spans) {
            for (let i = 0; i < spans.length; i++) {
                spans[i].style.backgroundColor = `rgba(0, 0, 0, ${backgroundColorRodape})`;
            }
        }
    });
    // FIM Fundo Cor Inferior

    modalContent.appendChild(switchLegendaRodapeButton);
    modalContent.appendChild(lagRodapeLabel);
    modalContent.appendChild(lagRodapeInput);
    modalContent.appendChild(document.createElement('br'));

    modalContent.appendChild(fonteRodapeLabel);
    modalContent.appendChild(sliderFonteRodapeInput);
    modalContent.appendChild(valueDisplaySliderFonteRodapeInput);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoRodapeLabel);
    modalContent.appendChild(sliderPosicaoRodapeInput);
    modalContent.appendChild(valueDisplaySliderPosicaoRodapeInput);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoRodapeSliderLabel);
    modalContent.appendChild(sliderPosicaoRodapeSliderLabel);
    modalContent.appendChild(valueDisplaySliderPosicaoRodapeSliderLabel);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(backgroundColorRodapeLabel);
    modalContent.appendChild(sliderBackgroundColorRodapeInput);
    modalContent.appendChild(valueDisplaySliderBackgroundColorRodapeInput);
}


function handleFontFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const fontData = reader.result;
        addFontToPage(fontData);

        localStorage.setItem('fontBase64', fontData);
        document.querySelector("#fontFileInput").value = '';
    };

    reader.readAsDataURL(file);
}

function addFontToPage(fontData) {
    if (!fontData) {
        return;
    }

    let novaFonte = new FontFace('NovaFonte', `url(${fontData})`);
    novaFonte.load().then(function (loadedFont) {
        document.fonts.add(loadedFont);
    }).catch(function (error) {
        console.error('Erro ao carregar a fonte:', error);
    });
}
