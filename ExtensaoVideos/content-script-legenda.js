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

var lagLegendaRodape = 1100;
var lagLegendaTopo = 1100;
var fonteLegendaTopo = 32;
var fonteLegendaRodape = 32;
var posicaoLegendaTopo = 530;
var posicaoLegendaRodape = 220;

var legendaRodapeInterval = 0;
var legendaTopoInterval = 0;
var legendaTopoLigar = false;
var legendaRodapeLigar = false;
var legendaRodape;
var legendaTopo;
var legendas = [];

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
            openModal();
        }
    }
}

function criarLegendaRodape() {
    let legenda = document.createElement('div');
    legenda.setAttribute('id', 'legendaRodapeHtml');
    legenda.style.position = 'fixed';
    legenda.style.bottom = posicaoLegendaRodape + 'px';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.color = '#fff';
    legenda.style.fontSize = fonteLegendaRodape + 'px';
    legenda.style.textAlign = 'center';
    legenda.style.pointerEvents = 'none';
    legenda.innerText = 'Texto da legenda';

    return legenda;
}

function criarLegendaTopo() {
    let legenda = document.createElement('div');
    legenda.setAttribute('id', 'legendaTopoHtml');
    legenda.style.position = 'fixed';
    legenda.style.bottom = posicaoLegendaTopo + 'px';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.color = '#fff';
    legenda.style.fontSize = fonteLegendaTopo + 'px';
    legenda.style.textAlign = 'center';
    legenda.style.pointerEvents = 'none';
    legenda.innerText = 'Texto da legenda';

    return legenda;
}

function parsearArquivoLegenda(legendas) {
    let listaBlocosAux = [];
    let linhas = legendas.split('\r\n');

    let contaLinha = 1;
    let blocoObjeto = { legenda: '' };
    for (let i = 0; i < linhas.length; i++) {
        let linha = linhas[i];

        if (linha != '') {
            if (contaLinha === 2) {
                var splitTempo = linha.split('-->');
                blocoObjeto.inicio = converterParaMilissegundos(splitTempo[0].trim());
                blocoObjeto.fim = converterParaMilissegundos(splitTempo[1].trim());
            }

            if (contaLinha > 2) {
                // blocoObjeto.legenda += `<div style="padding: 0px 0px 6px;"><span style="background-color: rgba(0, 0, 0, 0.5); padding: 0px 0px 6px;">${linha}</span></div>`;
                blocoObjeto.legenda += `<div style="padding: 0px 0px 6px;">
                    <span style="background-color: rgba(0, 0, 0, 0.5); padding: 0px 0px 6px;">${linha}</span>
                    </div>`;
            }

            contaLinha++;
        }

        if (linha == '' && blocoObjeto.legenda !== '') {
            listaBlocosAux.push(blocoObjeto);
            blocoObjeto = { legenda: '' };
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
    modal.style.zIndex = '1';
    modal.style.right = '0';
    modal.style.top = '20%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    // Cria o conteúdo do modal
    var modalContent = document.createElement('div');
    modalContent.setAttribute('id', 'modal-content');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '0 0 0 auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.maxWidth = '290px';

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
    var labelTopo = document.createElement('label');
    labelTopo.setAttribute('for', 'legendaTopo');
    labelTopo.innerHTML = 'Legenda do Topo:';
    var inputTopo = document.createElement('input');
    inputTopo.setAttribute('type', 'file');
    inputTopo.setAttribute('id', 'legendaTopo');
    inputTopo.style.marginRight = '10px';

    var labelRodape = document.createElement('label');
    labelRodape.setAttribute('for', 'legendaRodape');
    labelRodape.innerHTML = 'Legenda do Rodapé:';
    var inputRodape = document.createElement('input');
    inputRodape.setAttribute('type', 'file');
    inputRodape.setAttribute('id', 'legendaRodape');

    // Adiciona os elementos ao modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(document.createElement('br'));
    // modalContent.appendChild(labelTopo);
    modalContent.appendChild(inputTopo);

    addInputsTopo(modalContent);

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(document.createElement('br'));
    // modalContent.appendChild(labelRodape);
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
            legendaTopoLigar = true;

            if (!document.getElementById('legendaTopoHtml')) {
                legendaTopoHtml = criarLegendaTopo();
                document.body.appendChild(legendaTopoHtml);
            }

            document.getElementById('switchLegendaTopoButton').checked = true;

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
                    if (legendaTopoHtml.innerHTML != subtitle.legenda) {
                        legendaTopoHtml.innerHTML = subtitle.legenda;
                        legendaTopoHtml.style.display = 'block';
                    }
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
            legendaRodapeLigar = true;

            if (!document.getElementById('legendaRodapeHtml')) {
                legendaRodapeHtml = criarLegendaRodape();
                document.body.appendChild(legendaRodapeHtml);
            }

            document.getElementById('switchLegendaRodapeButton').checked = true;

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
                    if (legendaRodapeHtml.innerHTML != subtitle.legenda) {
                        legendaRodapeHtml.innerHTML = subtitle.legenda;
                        legendaRodapeHtml.style.display = 'block';
                    }
                } else {
                    legendaRodapeHtml.innerHTML = '';
                    legendaRodapeHtml.style.display = 'none';
                }

            }, 10);
        };
        reader.readAsText(file);
    });
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
    switchLegendaTopoButton.innerHTML = 'Desligar legenda topo';

    var switchLegendaTopo = document.createElement('input');
    switchLegendaTopo.setAttribute('type', 'checkbox');
    switchLegendaTopo.setAttribute('id', 'switchLegendaTopoButton');

    switchLegendaTopoButton.appendChild(switchLegendaTopo);

    // Adiciona o ouvinte de evento ao checkbox
    switchLegendaTopo.addEventListener('change', function () {
        legendaTopoLigar = this.checked
    });

    // INPUTS Lag topo
    var lagTopoLabel = document.createElement('label');
    lagTopoLabel.setAttribute('for', 'lagTopo');
    lagTopoLabel.innerHTML = 'Lag topo';

    var lagTopoInput = document.createElement('input');
    lagTopoInput.setAttribute('type', 'number');
    lagTopoInput.setAttribute('id', 'lagTopo');
    lagTopoInput.value = lagLegendaTopo;

    lagTopoInput.addEventListener('input', function () {
        lagLegendaTopo = Number(this.value);
    });

    var lagTopoAviso = document.createElement('span');
    lagTopoAviso.innerHTML = '<i>*não aperte APAGAR na HBO Max, aperte DEL</i>'
    lagTopoAviso.innerHTML += '<br><i>HBO MAX: 1100</i>'

    // INPUTS fonte topo
    var fonteTopoLabel = document.createElement('label');
    fonteTopoLabel.setAttribute('for', 'fonteTopo');
    fonteTopoLabel.innerHTML = 'Fonte topo';

    var fonteTopoInput = document.createElement('input');
    fonteTopoInput.setAttribute('type', 'number');
    fonteTopoInput.setAttribute('id', 'fonteTopo');
    fonteTopoInput.value = fonteLegendaTopo;

    fonteTopoInput.addEventListener('input', function () {
        fonteLegendaTopo = Number(this.value);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        legendaTopoHtml.style.fontSize = fonteLegendaTopo + 'px';
    });

    // INPUTS posição legenda topo
    var posicaoTopoLabel = document.createElement('label');
    posicaoTopoLabel.setAttribute('for', 'posicaoTopo');
    posicaoTopoLabel.innerHTML = 'Posição topo';

    var posicaoTopoInput = document.createElement('input');
    posicaoTopoInput.setAttribute('type', 'number');
    posicaoTopoInput.setAttribute('id', 'posicaoTopo');
    posicaoTopoInput.value = posicaoLegendaTopo;

    posicaoTopoInput.addEventListener('input', function () {
        posicaoLegendaTopo = Number(this.value);

        let legendaTopoHtml = document.getElementById('legendaTopoHtml');
        legendaTopoHtml.style.bottom = posicaoLegendaTopo + 'px';
    });

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(switchLegendaTopoButton);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(lagTopoLabel);
    modalContent.appendChild(lagTopoInput);
    // modalContent.appendChild(lagTopoAviso);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(fonteTopoLabel);
    modalContent.appendChild(fonteTopoInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoTopoLabel);
    modalContent.appendChild(posicaoTopoInput);
}


function addInputsRodape(modalContent) {

    // Cria o botão switch Rodape
    var switchLegendaRodapeButton = document.createElement('label');
    switchLegendaRodapeButton.setAttribute('class', 'switch');
    switchLegendaRodapeButton.setAttribute('for', 'switchLegendaRodapeButton');
    switchLegendaRodapeButton.innerHTML = 'Desligar legenda Rodape';

    var switchLegendaRodape = document.createElement('input');
    switchLegendaRodape.setAttribute('type', 'checkbox');
    switchLegendaRodape.setAttribute('id', 'switchLegendaRodapeButton');

    switchLegendaRodapeButton.appendChild(switchLegendaRodape);

    // Adiciona o ouvinte de evento ao checkbox
    switchLegendaRodape.addEventListener('change', function () {
        legendaRodapeLigar = this.checked
    });

    // INPUTS Lag Rodape
    var lagRodapeLabel = document.createElement('label');
    lagRodapeLabel.setAttribute('for', 'lagRodape');
    lagRodapeLabel.innerHTML = 'Lag Rodape';

    var lagRodapeInput = document.createElement('input');
    lagRodapeInput.setAttribute('type', 'number');
    lagRodapeInput.setAttribute('id', 'lagRodape');
    lagRodapeInput.value = lagLegendaRodape;

    lagRodapeInput.addEventListener('input', function () {
        lagLegendaRodape = Number(this.value);
    });

    var lagRodapeAviso = document.createElement('span');
    lagRodapeAviso.innerHTML = '<i>*não aperte APAGAR na HBO Max, aperte DEL</i>'
    lagRodapeAviso.innerHTML += '<br><i>HBO MAX: 1100</i>'

    // INPUTS fonte Rodape
    var fonteRodapeLabel = document.createElement('label');
    fonteRodapeLabel.setAttribute('for', 'fonteRodape');
    fonteRodapeLabel.innerHTML = 'Fonte Rodape';

    var fonteRodapeInput = document.createElement('input');
    fonteRodapeInput.setAttribute('type', 'number');
    fonteRodapeInput.setAttribute('id', 'fonteRodape');
    fonteRodapeInput.value = fonteLegendaRodape;

    fonteRodapeInput.addEventListener('input', function () {
        fonteLegendaRodape = Number(this.value);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        legendaRodapeHtml.style.fontSize = fonteLegendaRodape + 'px';
    });

    // INPUTS posição legenda Rodape
    var posicaoRodapeLabel = document.createElement('label');
    posicaoRodapeLabel.setAttribute('for', 'posicaoRodape');
    posicaoRodapeLabel.innerHTML = 'Posição Rodape';

    var posicaoRodapeInput = document.createElement('input');
    posicaoRodapeInput.setAttribute('type', 'number');
    posicaoRodapeInput.setAttribute('id', 'posicaoRodape');
    posicaoRodapeInput.value = posicaoLegendaRodape;

    posicaoRodapeInput.addEventListener('input', function () {
        posicaoLegendaRodape = Number(this.value);

        let legendaRodapeHtml = document.getElementById('legendaRodapeHtml');
        legendaRodapeHtml.style.bottom = posicaoLegendaRodape + 'px';
    });

    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(switchLegendaRodapeButton);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(lagRodapeLabel);
    modalContent.appendChild(lagRodapeInput);
    // modalContent.appendChild(lagRodapeAviso);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(fonteRodapeLabel);
    modalContent.appendChild(fonteRodapeInput);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(posicaoRodapeLabel);
    modalContent.appendChild(posicaoRodapeInput);
}