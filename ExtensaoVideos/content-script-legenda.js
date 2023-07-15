if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLegenda);
} else {
    afterDOMLegenda();
}

var adiantoLegendaRodape = 1000;
var adiantoLegendaTopo = 1000;
var legendaRodapeInterval = 0;
var legendaTopoInterval = 0;
var legendaRodape;
var legendaTopo;
var legendas = [];

function afterDOMLegenda() {
    console.log('Fone Helper Rodando! - Legenda');

    setTimeout(() => {
        criarModal();
    }, 1000);

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
    legenda.style.bottom = '220px';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    legenda.style.color = '#fff';
    legenda.style.padding = '0 0 6px 0';
    legenda.style.fontSize = '32px';
    legenda.style.textAlign = 'center';
    legenda.innerText = 'Texto da legenda';

    return legenda;
}

function criarLegendaTopo() {
    let legenda = document.createElement('div');
    legenda.setAttribute('id', 'legendaTopoHtml');
    legenda.style.position = 'fixed';
    legenda.style.bottom = '530px';
    legenda.style.left = '0';
    legenda.style.width = '100%';
    legenda.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    legenda.style.color = '#fff';
    legenda.style.padding = '0 0 6px 0';
    legenda.style.fontSize = '32px';
    legenda.style.textAlign = 'center';
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
                blocoObjeto.legenda += `<div>${linha}</div>`;
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
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    // Cria o conteúdo do modal
    var modalContent = document.createElement('div');
    modalContent.setAttribute('id', 'modal-content');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '15% auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '600px';

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
    modalContent.appendChild(labelTopo);
    modalContent.appendChild(inputTopo);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(labelRodape);
    modalContent.appendChild(inputRodape);

    modal.appendChild(modalContent);

    // Adiciona o modal ao body
    document.body.appendChild(modal);


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

            let legendas = parsearArquivoLegenda(contents);
            const video = document.querySelector('video');

            clearInterval(legendaRodapeInterval);
            legendaRodapeInterval = setInterval(() => {

                const currentTime = (video.currentTime * 1000) + adiantoLegendaRodape;
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

            let legendas = parsearArquivoLegenda(contents);
            const video = document.querySelector('video');

            clearInterval(legendaTopoInterval);
            legendaTopoInterval = setInterval(() => {

                const currentTime = (video.currentTime * 1000) + adiantoLegendaTopo;
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
}

function openModal() {
    document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}