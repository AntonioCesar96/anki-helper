'use strict';

const cheerio = require('cheerio');
var util = require('util');
var exec = util.promisify(require('child_process').exec);
const puppeteer = require('puppeteer');

var tamanhoBuffer = 10000;

async function obterHtml(command) {
  let { stdout, stderr } = await exec(command, { maxBuffer: 1024 * tamanhoBuffer });
  return stdout;
}

exports.buscarDefinicaoCambridge = async palavra => {
  var palavraBusca = palavra.replaceAll(' ', '+');

  var stdout = await obterHtml('curl -X GET https://dictionary.cambridge.org/pt/dicionario/ingles/' + palavraBusca);

  if (!stdout || stdout === '') {
    stdout = await obterHtml('curl -L GET https://dictionary.cambridge.org/pt/dicionario/ingles/' + palavraBusca);
  }

  const $ = cheerio.load(stdout);

  var dicionarioBritanico = buscarPalavraSimples($, 'Britânico');
  // var dicionarioAmericano = buscarPalavraSimples($, 'Americano');

  return dicionarioBritanico;
}

function buscarPalavraSimples($, dicionario) {
  var dataId = '';
  if (dicionario === 'Britânico') {
    dataId = 'cald4';
  } else if (dicionario === 'Americano') {
    dataId = 'cacd';
  }

  // Body
  var definicoes = [];
  var el_definicoes = $('div[data-id="' + dataId + '"] .dsense');
  for (let j = 0; j < el_definicoes.length; j++) {
    var definicao = $(el_definicoes[j]).find('.def-block .ddef_h .def').text().trim();

    if (!definicao)
      continue;

    var exemplos = [];
    var el_exemplos = $(el_definicoes[j]).find('.def-block .examp');
    for (let n = 0; n < el_exemplos.length; n++) {
      var exemplo = $(el_exemplos[n]).text().trim();

      if (exemplo && n < 10)
        exemplos.push({ exemplo: exemplo, id: 'e' + ((+new Date) + Math.random() * 100).toString(32) });
    }

    definicoes.push({  origem: '- Cambridge', definicao: definicao, exemplos: exemplos });
  }

  return definicoes;
}