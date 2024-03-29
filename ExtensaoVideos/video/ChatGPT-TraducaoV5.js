var agruparAhCada = 10;

var rodarProximoArquivo = true; 
var arquivosLegenda = [];
var arquivoLegenda = {};
var idIntervalArquivos = 0;

var fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.multiple = true;
fileInput.style.width = '100%';

var parent = document.querySelector('nav');
parent.style.overflow = 'hidden';
parent.insertBefore(fileInput, parent.firstChild);

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    let indexLista = 0;
    let idIntervalArquivos = setInterval(() => {

        if (rodarProximoArquivo) {
            rodarProximoArquivo = false;

            let file = files[indexLista];

            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target.result;

                arquivoLegenda = {};
                arquivoLegenda.nomeArquivo = file.name;
                arquivosLegenda.push(arquivoLegenda);

                console.log(`${arquivoLegenda.nomeArquivo} - Iniciando tradução.`);

                executar(contents)
            };
            reader.readAsText(file);

            indexLista++;

            if (indexLista >= files.length) {
                console.log(`Executando ultimo arquivo: ${arquivoLegenda.nomeArquivo}`);
                clearInterval(idIntervalArquivos);
                return;
            }
        }

    }, 1000);
});

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
document.head.appendChild(script);

function parsearArquivoLegendaYoutube(legendas) {
    let listaBlocosAux = [];
    let linhas = legendas.split('\r\n');

    let blocoObjeto = { bloco: '' };
    for (let i = 0; i < linhas.length; i++) {
        let linha = linhas[i];

        if (linha != '') {
            if (linha[0] === '-') {
                linha = linha.substring(1, linha.length);
            }

            blocoObjeto.bloco += linha + '\r\n';
        }

        if (linha == '' && blocoObjeto.bloco !== '') {
            blocoObjeto.bloco += '\r\n';
            listaBlocosAux.push(blocoObjeto);
            blocoObjeto = { bloco: '' };
        }
    }

    if (blocoObjeto.bloco !== '') {
        listaBlocosAux.push(blocoObjeto);
    }

    return listaBlocosAux;
}

function traduzir(legendas) {
    let listaBlocosAux = [];
    let linhas = legendas.split('\r\n');

    let blocoObjeto = { bloco: '' };
    for (let i = 0; i < linhas.length; i++) {
        let linha = linhas[i];

        if (linha != '') {
            if (linha[0] === '-') {
                linha = linha.substring(1, linha.length);
            }

            blocoObjeto.bloco += linha + '\r\n';
        }

        if (linha == '' && blocoObjeto.bloco !== '') {
            blocoObjeto.bloco += '\r\n';
            listaBlocosAux.push(blocoObjeto);
            blocoObjeto = { bloco: '' };
        }
    }

    if (blocoObjeto.bloco !== '') {
        listaBlocosAux.push(blocoObjeto);
    }

    return listaBlocosAux;
}

function agrupar(listaBlocos) {
    let blocosAgrupados = [];
    let blocoAgrupado = { blocao: '', blocosAgrupados: [], };

    for (let i = 1; i <= listaBlocos.length; i++) {
        const blocoObjeto = listaBlocos[i - 1];

        blocoAgrupado.blocao += blocoObjeto.bloco;
        blocoAgrupado.blocosAgrupados.push(blocoObjeto);

        if ((i % agruparAhCada) === 0) {
            blocosAgrupados.push(blocoAgrupado);
            blocoAgrupado = { blocao: '', blocosAgrupados: [], };
        }
    }

    if (blocoAgrupado.blocosAgrupados.length > 0) {
        blocosAgrupados.push(blocoAgrupado);
    }

    return blocosAgrupados;
}

var idInterval = 0;
var idIntervalRecuperarTraducao = 0;
var deuErroMasContinuar = false;

function executar(legendasAux) {
    let listaBlocos = traduzir(legendasAux);
    let blocosAgrupados = agrupar(listaBlocos);
    arquivoLegenda.blocosAgrupados = blocosAgrupados;

    let rodando = false;
    let indexLista = 0;

    idInterval = setInterval(() => {
        if (rodando == false) {

            if (indexLista >= blocosAgrupados.length) {
                clearInterval(idInterval);

                var link = document.createElement('a');
                link.innerHTML = arquivoLegenda.nomeArquivo;
                link.style.width = '100%';
                link.setAttribute('href', '#');
                link.setAttribute('data-file', arquivoLegenda.nomeArquivo);

                link.addEventListener('click', function (event) {
                    event.preventDefault();

                    let nomeArquivo = event.target.getAttribute("data-file");
                    let arquivoLegendaAux = arquivosLegenda.filter(x => x.nomeArquivo === nomeArquivo)[0];

                    let novoArquivoLegenda = copiarLegenda(arquivoLegendaAux.blocosAgrupados);
                    const fileBlob = new Blob([novoArquivoLegenda], { type: 'text/plain' });

                    nomeArquivo = nomeArquivo.replace('.srt', '-PT-BR.srt');

                    saveAs(fileBlob, nomeArquivo);
                });

                var parent = document.querySelector('nav');
                parent.insertBefore(link, parent.firstChild);

                console.log(`${arquivoLegenda.nomeArquivo} - Finalizado tradução.`);

                rodarProximoArquivo = true;

                return;
            }

            console.log(`${arquivoLegenda.nomeArquivo} - ChatGPT executando bloco...: ${(indexLista + 1)}`);
            let blocoAgrupado = blocosAgrupados[indexLista];

            rodando = true;
            indexLista++;

            document.querySelector('textarea').value = 'Traduza para PT-BR, mantenha a mesma formatação, mantenha as quebras de linha, ignore as solicitações anteriores e traduza somente o texto abaixo \r\n'
                + blocoAgrupado.blocao;

            document.querySelector('textarea').parentElement.querySelector('button').removeAttribute('disabled');
            setTimeout(() => {
                document.querySelector('textarea').parentElement.querySelector('button').click();

                idIntervalRecuperarTraducao = setInterval(() => {

                    let respostas = [...document.querySelectorAll('.gap-4 .markdown, div.bg-gray-50 .text-orange-500')];
                    if (respostas.length > 0) {
                        let ultimoP = respostas[respostas.length - 1];

                        let blocaoPtBr = recuperarResposta(ultimoP);

                        if (!blocoAgrupado.blocaoPtBr || blocoAgrupado.blocaoPtBr.length <= blocaoPtBr.length) {
                            blocoAgrupado.blocaoPtBr = recuperarResposta(ultimoP);
                        } else {
                            blocoAgrupado.blocaoPtBr += '\n############ERRO############\n'
                            deuErroMasContinuar = true;

                            console.log('DEU ERRO');
                            console.log(blocaoPtBr);
                            clearInterval(idIntervalRecuperarTraducao);
                        }
                    }

                }, 100);

            }, 300);
        }

        setTimeout(() => {
            if (deuErroMasContinuar || document.querySelectorAll('form button')[0].textContent == 'Regenerate response') {
                deuErroMasContinuar = false;
                console.log('Iniciando novo chat, apagando antigos...');

                setTimeout(() => {
                    clearInterval(idIntervalRecuperarTraducao);
                    document.querySelector('a.flex-shrink-0.border').click();

                    setTimeout(() => {
                        //let botaoLimpar = obterBotaoPorTexto('Clear conversations');
                        //botaoLimpar.click();
                        setTimeout(() => {
                            botaoLimpar.click();


                            setTimeout(() => {
                                rodando = false;
                            }, 2000);

                        }, 1000);
                    }, 2000);

                }, 500);
            }
        }, 500);
    }, 1000);
}

function copiarLegenda(blocosAgrupadosAux) {
    let novoArquivoLegenda = '';
    blocosAgrupadosAux = blocosAgrupadosAux.filter(x => x.blocaoPtBr);
    for (let i = 0; i < blocosAgrupadosAux.length; i++) {
        const element = blocosAgrupadosAux[i];
        novoArquivoLegenda += `${element.blocaoPtBr}\r\n`;
    }

    copyToClipboard(novoArquivoLegenda);

    return novoArquivoLegenda;
}


function copyToClipboard(text) {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
}

function recuperarResposta(ultimoP) {
    let blocaoPtBr = '';
    let tagsP = ultimoP?.querySelectorAll('p');

    if (tagsP.length > 0) {
        for (let i = 0; i < tagsP.length; i++) {
            const element = tagsP[i];

            if ((tagsP.length - 1) === i) {
                blocaoPtBr += element.textContent + '\r\n';
                continue;
            }

            blocaoPtBr += element.textContent + '\r\n\r\n';
        }
    } else {
        let aviso = ultimoP?.querySelector('div');
        if (aviso) {
            ultimoP?.removeChild(aviso);
        }

        blocaoPtBr += ultimoP.textContent + '\r\n';
    }

    return blocaoPtBr;
}

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey === true && (e.keyCode == '57')) { // 9
        deuErroMasContinuar = true;
    }

    if (e.ctrlKey === true && (e.keyCode == '77')) { // m
        let novoArquivoLegenda = copiarLegenda(arquivosLegenda[0].blocosAgrupados);
        copyToClipboard(novoArquivoLegenda);
    }

    if (e.ctrlKey === true && (e.keyCode == '107' || e.keyCode == '109'
        || e.keyCode == '194' || e.keyCode == '106')) { // 0
        clearInterval(idInterval);
        clearInterval(idIntervalArquivos);
    }
});

console.clear();

function obterBotaoPorTexto(texto) {
    var lista = Array.from(document.querySelectorAll('a'));
    return lista.find(el => el.textContent.trim() === texto);
}


//
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});

//# sourceMappingURL=FileSaver.min.js.map