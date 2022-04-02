'use strict';

const cheerio = require('cheerio');
var util = require('util');
var exec = util.promisify(require('child_process').exec);

var tamanhoBuffer = 10000;

async function obterHtml(command) {
  let { stdout, stderr } = await exec(command, {maxBuffer: 1024 * tamanhoBuffer});
  return stdout;
}

exports.buscarDefinicaoCambridge = async palavra => {
  var palavraBusca = palavra.replaceAll(' ', '-');

  var stdout = await obterHtml('curl -X GET https://dictionary.cambridge.org/pt/dicionario/ingles/' + palavraBusca);
  
  if(!stdout || stdout === '') {
    stdout = await obterHtml('curl -L GET https://dictionary.cambridge.org/pt/dicionario/ingles/' + palavraBusca);
  }
  
  const $ = cheerio.load(stdout);

  var dicionarioBritanico = buscarPalavraSimples($, 'Britânico');
  // var dicionarioAmericano = buscarPalavraSimples($, 'Americano');
  var dicionarios = [ dicionarioBritanico ];

  var pronuncias = agruparPronuncias(dicionarios);
  var dicionariosAgrupados = agruparDicionarios(dicionarios);

  return {
    key: "cambridge",
    body: { palavra: dicionarioBritanico.palavra, pronuncias: pronuncias, dicionarios: dicionariosAgrupados }
  };
}

function agruparPronuncias(dicionarios) {
  var pronuncias = dicionarios.flatMap(x => x.classesGramaticais).flatMap(x => x.pronuncias);
  var pronunciasAux = pronuncias.filter(x => x.regiao === 'us');

  if(pronunciasAux.length === 0) {
    pronunciasAux = pronuncias;
  }

  return pronunciasAux.filter((v,i,a)=>a.findIndex(t=>(t.pronuncia === v.pronuncia))===i);
}

function agruparDicionarios(dicionarios) {

  var dicionariosAgrupados = [];
  for (let i = 0; i < dicionarios.length; i++) {
    const dicionario = dicionarios[i];
    var definicoes = dicionario.classesGramaticais.flatMap(x => x.definicoes);

    dicionariosAgrupados.push({dicionario: dicionario.dicionario, significados: definicoes});
  }

  return dicionariosAgrupados;
}

// Criar versções do metodo que se nao axar a primeira coisa, tenta varrer de outra forma com outros elementos
function buscarPalavraSimples($, dicionario) {
  var dataId = '';
  if(dicionario === 'Britânico') {
    dataId = 'cald4';
  } else if(dicionario === 'Americano') {
    dataId = 'cacd';
  }

  var el_dicBritanico = $('div[data-id="' + dataId + '"]');
  var el_classesGramaticais = $(el_dicBritanico).find('.entry-body__el');

  var palavraHtml = '';
  var classesGramaticais = [];
  for (let i = 0; i < el_classesGramaticais.length; i++) {

    // Header
    var classeGramatical = $(el_classesGramaticais[i]).find('.pos-header .pos.dpos').first().text().trim();

    if(palavraHtml == '') {
      palavraHtml = $(el_classesGramaticais[i]).find('.pos-header .di-title').text().trim();
    }
    
    var pronuncias = [];
    var el_regioes = $(el_classesGramaticais[i]).find('.pos-header .dpron-i');
    for (let j = 0; j < el_regioes.length; j++) {
      var regiao = $(el_regioes[j]).find('.region').text().trim();
      var pronuncia = $(el_regioes[j]).find('.pron').text().trim();

      pronuncias.push({classeGramatical: classeGramatical, regiao: regiao, pronuncia: pronuncia});
    }

    // Body
    var definicoes = [];
    var el_definicoes = $(el_classesGramaticais[i]).find('.dsense');
    for (let j = 0; j < el_definicoes.length; j++) {
      var definicao = $(el_definicoes[j]).find('.def-block .ddef_h .def').text().trim();
      
      if(!definicao)
      continue;

      var sentido = $(el_definicoes[j]).find('.dsense_h').text()
        .trim()
        .replaceAll('[T]', '')
        .replaceAll('[C]', '');

      var exemplos = [];
      var el_exemplos = $(el_definicoes[j]).find('.def-block .examp');
      for (let n = 0; n < el_exemplos.length; n++) {
        var exemplo = $(el_exemplos[n]).text().trim();
  
        if(exemplo && n < 10)
          exemplos.push({exemplo: exemplo, id: 'e'+((+new Date) + Math.random()* 100).toString(32)});
      }

      var id = ((+new Date) + Math.random()* 100).toString(32);
      definicoes.push({id: id, classeGramatical: classeGramatical, sentido: sentido, definicao: definicao, exemplos: exemplos});

    }

    classesGramaticais.push({classeGramatical: classeGramatical, pronuncias: pronuncias, definicoes: definicoes});
  }

  return { palavra: palavraHtml, dicionario: dicionario, classesGramaticais: classesGramaticais };
}