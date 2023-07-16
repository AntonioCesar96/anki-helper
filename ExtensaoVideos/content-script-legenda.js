var sitesHome = [
    { host: "www.netflix.com", },
    { host: "www.primevideo.com" },
    { host: "play.hbomax.com" },
    { host: "www.disneyplus.com" },
    { host: "www.starplus.com" },
    { host: "www.southparkstudios.com.br" },
]

var siteHome = sitesHome.filter(x => x.host === location.host)[0];
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
var posicaoLegendaTopo = obterVariavel('posicaoLegendaTopo') ? obterVariavel('posicaoLegendaTopo') : 50;
var posicaoLegendaRodape = obterVariavel('posicaoLegendaRodape') ? obterVariavel('posicaoLegendaRodape') : 50;

var posicaoLegendaSliderTopo = obterVariavel('posicaoLegendaSliderTopo') ? obterVariavel('posicaoLegendaSliderTopo') : 50;
var posicaoLegendaSliderRodape = obterVariavel('posicaoLegendaSliderRodape') ? obterVariavel('posicaoLegendaSliderRodape') : 50;

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

    setTimeout(() => {
        criarModal();
    }, 1000);

    setTimeout(() => {
        openModal();
    }, 1100);

    document.addEventListener('keydown', checkKey);

    async function checkKey(e) {
        e = e || window.event;

        console.log(e.keyCode);

        if (e.keyCode == '49') { // 1
            if (document.getElementById('modal').style.display === 'block') {
                closeModal();
            } else {
                openModal();
            }
        }

        if (e.keyCode == '50') { // 2
            legendaTopoLigar = !legendaTopoLigar;
            document.getElementById('switchLegendaTopoButton').checked = legendaTopoLigar;
        }

        if (e.keyCode == '51') { // 3
            legendaRodapeLigar = !legendaRodapeLigar;
            document.getElementById('switchLegendaRodapeButton').checked = legendaRodapeLigar;
        }
    }
}

function criarLegendaRodape() {
    let legenda = document.createElement('div');
    legenda.setAttribute('id', 'legendaRodapeHtml');
    legenda.style.position = 'fixed';
    legenda.style.zIndex = '99999999999';
    legenda.style.bottom = posicaoLegendaRodape + 'px';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.color = '#fff';
    legenda.style.fontSize = fonteLegendaRodape + 'px';
    // legenda.style.fontFamily = 'cinecav-sans-regular';
    legenda.style.textAlign = 'center';
    legenda.style.pointerEvents = 'none';
    legenda.innerText = 'Texto da legenda';

    return legenda;
}

function criarLegendaTopo() {
    let legenda = document.createElement('div');
    legenda.setAttribute('id', 'legendaTopoHtml');
    legenda.style.position = 'fixed';
    legenda.style.zIndex = '99999999999';
    legenda.style.top = posicaoLegendaTopo + 'px';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.color = '#fff';
    legenda.style.fontSize = fonteLegendaTopo + 'px';
    // legenda.style.fontFamily = 'cinecav-sans-regular';
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
    modalContent.style.padding = '20px';
    modalContent.style.paddingTop = '0';
    modalContent.style.border = '1px solid #888';
    modalContent.style.maxWidth = '290px';
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

    // Cria os inputs de arquivo e as labels
    var inputTopo = document.createElement('input');
    inputTopo.setAttribute('type', 'file');
    inputTopo.setAttribute('id', 'legendaTopo');
    inputTopo.style.fontSize = '13.3px';

    var inputRodape = document.createElement('input');
    inputRodape.setAttribute('type', 'file');
    inputRodape.setAttribute('id', 'legendaRodape');
    inputRodape.style.fontSize = '13.3px';

    // Adiciona os elementos ao modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(inputTopo);

    addInputsTopo(modalContent);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(inputRodape);

    addInputsRodape(modalContent);

    modal.appendChild(modalContent);

    // Adiciona o modal ao body
    document.body.appendChild(modal);

    // Topo
    inputTopo.addEventListener('change', (event) => {
        const files = event.target.files;
        let file = files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const contents = e.target.result;

            if (!document.getElementById('legendaTopoHtml')) {
                legendaTopoHtml = criarLegendaTopo();
                document.body.appendChild(legendaTopoHtml);
            }

            document.getElementById('switchLegendaTopoButton').checked = true;
            legendaTopoLigar = true;

            let legendas = parsearArquivoLegenda(contents);

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

                    legendaTopoHtml.style.top = obterVariacaoSeSliderVisivelTopo() + 'px';
                } else {
                    legendaTopoHtml.innerHTML = '';
                    legendaTopoHtml.style.display = 'none';
                }

            }, 10);
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

            if (!document.getElementById('legendaRodapeHtml')) {
                legendaRodapeHtml = criarLegendaRodape();
                document.body.appendChild(legendaRodapeHtml);
            }

            document.getElementById('switchLegendaRodapeButton').checked = true;
            legendaRodapeLigar = true;

            let legendas = parsearArquivoLegenda(contents);

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

                    legendaRodapeHtml.style.bottom = obterVariacaoSeSliderVisivelRodape() + 'px';
                } else {
                    legendaRodapeHtml.innerHTML = '';
                    legendaRodapeHtml.style.display = 'none';
                }

            }, 10);
        };
        reader.readAsText(file);
    });
}
// var sitesHome = [
//     { host: "www.netflix.com", },
//     { host: "www.primevideo.com" },
//     { host:  },
//     { host: "www.disneyplus.com" },
//     { host: "www.starplus.com" },
//     { host: "www.southparkstudios.com.br" },
// ]

function obterVariacaoSeSliderVisivelRodape() {
    if ((document.querySelector('div[data-testid="TimelineSlider"]') ||
        document.querySelector('.atvwebplayersdk-seekbar-container.show')) &&
        posicaoLegendaRodape < posicaoLegendaSliderRodape) {
        return posicaoLegendaSliderRodape;
    }


    return posicaoLegendaRodape;

}

function obterVariacaoSeSliderVisivelTopo() {
    if ((document.querySelector('div[data-testid="TimelineSlider"]') ||
        document.querySelector('.atvwebplayersdk-seekbar-container.show')) &&
        posicaoLegendaTopo < posicaoLegendaSliderTopo) {
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
    switchLegendaTopoButton.innerHTML = '<span style=" vertical-align: text-bottom;">Desligar legenda Topo</span>';
    switchLegendaTopoButton.style.display = 'block';
    switchLegendaTopoButton.style.margin = '8px 5px 10px 0';

    var switchLegendaTopo = document.createElement('input');
    switchLegendaTopo.setAttribute('type', 'checkbox');
    switchLegendaTopo.setAttribute('id', 'switchLegendaTopoButton');
    switchLegendaTopo.style.margin = '0';

    switchLegendaTopoButton.appendChild(switchLegendaTopo);

    // Adiciona o ouvinte de evento ao checkbox
    switchLegendaTopo.addEventListener('change', function () {
        legendaTopoLigar = this.checked
    });

    // INPUTS Lag topo
    var lagTopoLabel = document.createElement('label');
    lagTopoLabel.setAttribute('for', 'lagTopo');
    lagTopoLabel.innerHTML = 'Lag topo';
    lagTopoLabel.style.display = 'inline-block';
    lagTopoLabel.style.marginRight = '5px';

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

    var lagTopoAviso = document.createElement('span');
    lagTopoAviso.innerHTML = '<i>*não aperte APAGAR na HBO Max, aperte DEL</i>'
    lagTopoAviso.innerHTML += '<br><i>HBO MAX: 1100</i>'

    // INPUTS fonte topo
    var fonteTopoLabel = document.createElement('label');
    fonteTopoLabel.setAttribute('for', 'fonteTopo');
    fonteTopoLabel.innerHTML = 'Fonte topo';
    fonteTopoLabel.style.display = 'inline-block';
    fonteTopoLabel.style.marginRight = '5px';

    var fonteTopoInput = document.createElement('input');
    fonteTopoInput.setAttribute('type', 'number');
    fonteTopoInput.setAttribute('id', 'fonteTopo');
    fonteTopoInput.value = fonteLegendaTopo;
    fonteTopoInput.style.display = 'inline-block';
    fonteTopoInput.style.width = '100px';
    fonteTopoInput.style.height = '18px';

    fonteTopoInput.addEventListener('input', function () {
        fonteLegendaTopo = Number(this.value);
        salvarVariavel('fonteLegendaTopo', fonteLegendaTopo);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        if (legendaTopoHtml) {
            legendaTopoHtml.style.fontSize = fonteLegendaTopo + 'px';
        }
    });

    // INPUTS posição legenda topo
    var posicaoTopoLabel = document.createElement('label');
    posicaoTopoLabel.setAttribute('for', 'posicaoTopo');
    posicaoTopoLabel.innerHTML = 'Posição topo';
    posicaoTopoLabel.style.display = 'inline-block';
    posicaoTopoLabel.style.marginRight = '5px';

    var posicaoTopoInput = document.createElement('input');
    posicaoTopoInput.setAttribute('type', 'number');
    posicaoTopoInput.setAttribute('id', 'posicaoTopo');
    posicaoTopoInput.value = posicaoLegendaTopo;
    posicaoTopoInput.style.display = 'inline-block';
    posicaoTopoInput.style.width = '100px';
    posicaoTopoInput.style.height = '18px';

    posicaoTopoInput.addEventListener('input', function () {
        posicaoLegendaTopo = Number(this.value);
        salvarVariavel('posicaoLegendaTopo', posicaoLegendaTopo);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        if (legendaTopoHtml) {
            legendaTopoHtml.style.top = posicaoLegendaTopo + 'px';
        }
    });

    // INPUTS posição legenda slider topo
    var posicaoTopoSliderLabel = document.createElement('label');
    posicaoTopoSliderLabel.setAttribute('for', 'posicaoSliderTopo');
    posicaoTopoSliderLabel.innerHTML = 'Posição slider topo';
    posicaoTopoSliderLabel.style.display = 'inline-block';
    posicaoTopoSliderLabel.style.marginRight = '5px';

    var posicaoTopoSliderInput = document.createElement('input');
    posicaoTopoSliderInput.setAttribute('type', 'number');
    posicaoTopoSliderInput.setAttribute('id', 'posicaoSliderTopo');
    posicaoTopoSliderInput.value = posicaoLegendaSliderTopo;
    posicaoTopoSliderInput.style.display = 'inline-block';
    posicaoTopoSliderInput.style.width = '100px';
    posicaoTopoSliderInput.style.height = '18px';

    posicaoTopoSliderInput.addEventListener('input', function () {
        posicaoLegendaSliderTopo = Number(this.value);
        salvarVariavel('posicaoLegendaSliderTopo', posicaoLegendaSliderTopo);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        if (legendaTopoHtml) {
            legendaTopoHtml.style.top = posicaoLegendaSliderTopo + 'px';
        }
    });

    // INPUTS background color topo
    var backgroundColorTopoLabel = document.createElement('label');
    backgroundColorTopoLabel.setAttribute('for', 'backgroundColorTopo');
    backgroundColorTopoLabel.innerHTML = 'BackgroundColor Topo';
    backgroundColorTopoLabel.style.display = 'inline-block';
    backgroundColorTopoLabel.style.marginRight = '5px';

    var backgroundColorTopoInput = document.createElement('input');
    backgroundColorTopoInput.setAttribute('type', 'text');
    backgroundColorTopoInput.setAttribute('id', 'backgroundColorTopo');
    backgroundColorTopoInput.value = backgroundColorTopo;
    backgroundColorTopoInput.style.display = 'inline-block';
    backgroundColorTopoInput.style.width = '100px';
    backgroundColorTopoInput.style.height = '18px';

    backgroundColorTopoInput.addEventListener('input', function () {
        backgroundColorTopo = this.value;
        salvarVariavel('backgroundColorTopo', backgroundColorTopo);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        let spans = legendaTopoHtml?.querySelectorAll('span');
        if (legendaTopoHtml && spans) {
            for (let i = 0; i < spans.length; i++) {
                spans[i].style.backgroundColor = `rgba(0, 0, 0, ${backgroundColorTopo})`;
            }
        }
    });

    modalContent.appendChild(switchLegendaTopoButton);
    modalContent.appendChild(lagTopoLabel);
    modalContent.appendChild(lagTopoInput);
    // modalContent.appendChild(lagTopoAviso);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(fonteTopoLabel);
    modalContent.appendChild(fonteTopoInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoTopoLabel);
    modalContent.appendChild(posicaoTopoInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoTopoSliderLabel);
    modalContent.appendChild(posicaoTopoSliderInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(backgroundColorTopoLabel);
    modalContent.appendChild(backgroundColorTopoInput);
}


function addInputsRodape(modalContent) {

    // Cria o botão switch Rodape
    var switchLegendaRodapeButton = document.createElement('label');
    switchLegendaRodapeButton.setAttribute('class', 'switch');
    switchLegendaRodapeButton.setAttribute('for', 'switchLegendaRodapeButton');
    switchLegendaRodapeButton.innerHTML = '<span style=" vertical-align: text-bottom;">Desligar legenda Rodape</span>';
    switchLegendaRodapeButton.style.display = 'block';
    switchLegendaRodapeButton.style.margin = '8px 5px 10px 0';

    var switchLegendaRodape = document.createElement('input');
    switchLegendaRodape.setAttribute('type', 'checkbox');
    switchLegendaRodape.setAttribute('id', 'switchLegendaRodapeButton');
    switchLegendaRodape.style.margin = '0';

    switchLegendaRodapeButton.appendChild(switchLegendaRodape);

    // Adiciona o ouvinte de evento ao checkbox
    switchLegendaRodape.addEventListener('change', function () {
        legendaRodapeLigar = this.checked;
    });

    // INPUTS Lag Rodape
    var lagRodapeLabel = document.createElement('label');
    lagRodapeLabel.setAttribute('for', 'lagRodape');
    lagRodapeLabel.innerHTML = 'Lag Rodape';
    lagRodapeLabel.style.display = 'inline-block';
    lagRodapeLabel.style.marginRight = '5px';

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

    var lagRodapeAviso = document.createElement('span');
    lagRodapeAviso.innerHTML = '<i>*não aperte APAGAR na HBO Max, aperte DEL</i>'
    lagRodapeAviso.innerHTML += '<br><i>HBO MAX: 1100</i>'

    // INPUTS fonte Rodape
    var fonteRodapeLabel = document.createElement('label');
    fonteRodapeLabel.setAttribute('for', 'fonteRodape');
    fonteRodapeLabel.innerHTML = 'Fonte Rodape';
    fonteRodapeLabel.style.display = 'inline-block';
    fonteRodapeLabel.style.marginRight = '5px';

    var fonteRodapeInput = document.createElement('input');
    fonteRodapeInput.setAttribute('type', 'number');
    fonteRodapeInput.setAttribute('id', 'fonteRodape');
    fonteRodapeInput.value = fonteLegendaRodape;
    fonteRodapeInput.style.display = 'inline-block';
    fonteRodapeInput.style.width = '100px';

    fonteRodapeInput.addEventListener('input', function () {
        fonteLegendaRodape = Number(this.value);
        salvarVariavel('fonteLegendaRodape', fonteLegendaRodape);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        if (legendaRodapeHtml) {
            legendaRodapeHtml.style.fontSize = fonteLegendaRodape + 'px';
        }
    });

    // INPUTS posição legenda Rodape
    var posicaoRodapeLabel = document.createElement('label');
    posicaoRodapeLabel.setAttribute('for', 'posicaoRodape');
    posicaoRodapeLabel.innerHTML = 'Posição Rodape';
    posicaoRodapeLabel.style.display = 'inline-block';
    posicaoRodapeLabel.style.marginRight = '5px';

    var posicaoRodapeInput = document.createElement('input');
    posicaoRodapeInput.setAttribute('type', 'number');
    posicaoRodapeInput.setAttribute('id', 'posicaoRodape');
    posicaoRodapeInput.value = posicaoLegendaRodape;
    posicaoRodapeInput.style.display = 'inline-block';
    posicaoRodapeInput.style.width = '100px';

    posicaoRodapeInput.addEventListener('input', function () {
        posicaoLegendaRodape = Number(this.value);
        salvarVariavel('posicaoLegendaRodape', posicaoLegendaRodape);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        if (legendaRodapeHtml) {
            legendaRodapeHtml.style.bottom = posicaoLegendaRodape + 'px';
        }
    });


    // INPUTS posição legenda slider topo
    var posicaoRodapeSliderLabel = document.createElement('label');
    posicaoRodapeSliderLabel.setAttribute('for', 'posicaoSliderTopo');
    posicaoRodapeSliderLabel.innerHTML = 'Posição slider rodape';
    posicaoRodapeSliderLabel.style.display = 'inline-block';
    posicaoRodapeSliderLabel.style.marginRight = '5px';

    var posicaoRodapeSliderInput = document.createElement('input');
    posicaoRodapeSliderInput.setAttribute('type', 'number');
    posicaoRodapeSliderInput.setAttribute('id', 'posicaoSliderTopo');
    posicaoRodapeSliderInput.value = posicaoLegendaSliderRodape;
    posicaoRodapeSliderInput.style.display = 'inline-block';
    posicaoRodapeSliderInput.style.width = '100px';
    posicaoRodapeSliderInput.style.height = '18px';

    posicaoRodapeSliderInput.addEventListener('input', function () {
        posicaoLegendaSliderRodape = Number(this.value);
        salvarVariavel('posicaoLegendaSliderRodape', posicaoLegendaSliderRodape);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        if (legendaRodapeHtml) {
            legendaRodapeHtml.style.bottom = posicaoLegendaSliderRodape + 'px';
        }
    });

    // INPUTS background color rodape
    var backgroundColorRodapeLabel = document.createElement('label');
    backgroundColorRodapeLabel.setAttribute('for', 'backgroundColorRodape');
    backgroundColorRodapeLabel.innerHTML = 'BackgroundColor Rodape';
    backgroundColorRodapeLabel.style.display = 'inline-block';
    backgroundColorRodapeLabel.style.marginRight = '5px';

    var backgroundColorRodapeInput = document.createElement('input');
    backgroundColorRodapeInput.setAttribute('type', 'text');
    backgroundColorRodapeInput.setAttribute('id', 'backgroundColorRodape');
    backgroundColorRodapeInput.value = backgroundColorRodape;
    backgroundColorRodapeInput.style.display = 'inline-block';
    backgroundColorRodapeInput.style.width = '100px';
    backgroundColorRodapeInput.style.height = '18px';

    backgroundColorRodapeInput.addEventListener('input', function (e) {
        e.preventDefault();

        backgroundColorRodape = this.value;
        salvarVariavel('backgroundColorRodape', backgroundColorRodape);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        let spans = legendaRodapeHtml?.querySelectorAll('span');
        if (legendaRodapeHtml && spans) {
            for (let i = 0; i < spans.length; i++) {
                spans[i].style.backgroundColor = `rgba(0, 0, 0, ${backgroundColorRodape})`;
            }
        }
    });

    modalContent.appendChild(switchLegendaRodapeButton);
    modalContent.appendChild(lagRodapeLabel);
    modalContent.appendChild(lagRodapeInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(fonteRodapeLabel);
    modalContent.appendChild(fonteRodapeInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoRodapeLabel);
    modalContent.appendChild(posicaoRodapeInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoRodapeSliderLabel);
    modalContent.appendChild(posicaoRodapeSliderInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(backgroundColorRodapeLabel);
    modalContent.appendChild(backgroundColorRodapeInput);
}