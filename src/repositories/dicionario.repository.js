'use strict';

const cheerio = require('cheerio');
var util = require('util');
var exec = util.promisify(require('child_process').exec);

exports.buscarImagens = async palavra => {
  var palavraBusca = palavra.replace(' ', '+')
  var command = 'curl -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36" "https://www.google.com/search?tbm=isch&q=' + palavraBusca + '"';

  const { stdout, stderr } = await exec(command) 
  
  const $ = cheerio.load(stdout);

  var imagens = [];
  var el_imagens = $('#islmp img');
  for (let i = 0; i < el_imagens.length; i++) {
    var dataSrc = $(el_imagens[i]).attr('data-src');
    if(dataSrc)
      imagens.push({src: dataSrc});

  }

  return imagens;
}

// Context
exports.buscarTraducoesContext = async palavra => {
  var palavraBusca = palavra.replace(' ', '+')
  var command = 'curl -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36" https://context.reverso.net/traducao/ingles-portugues/' + palavraBusca

  const { stdout, stderr } = await exec(command) 
  const $ = cheerio.load(stdout);

  var traducoes = [];
  var el_traducoes = $('#translations-content .translation');
  for (let i = 0; i < el_traducoes.length; i++) {
    var traducao = $(el_traducoes[i]).text().trim();
    var grupo = $(el_traducoes[i]).attr('data-posgroup');
    var frequencia = $(el_traducoes[i]).attr('data-freq');
    var classeGramatical = $(el_traducoes[i]).attr('data-pos');
    var id = ((+new Date) + Math.random()* 100).toString(32);

    traducoes.push({id: id, traducao: traducao, classeGramatical: classeGramatical, grupo: grupo, frequencia: frequencia});

  }

  return traducoes;
}

// Cambridge
exports.buscarDefinicaoCambridge = async palavra => {
  var palavraBusca = palavra.replace(' ', '-');
  var command = 'curl -X GET https://dictionary.cambridge.org/pt/dicionario/ingles/' + palavraBusca;

  const { stdout, stderr } = await exec(command);
  const $ = cheerio.load(stdout);

  var dicionarioBritanico = buscarPalavraSimples($, 'Britânico');
  var dicionarioAmericano = buscarPalavraSimples($, 'Americano');
  var dicionarios = [ dicionarioBritanico, dicionarioAmericano ];

  var pronuncias = agruparPronuncias(dicionarios);
  var dicionariosAgrupados = agruparDicionarios(dicionarios);

  return { pronuncias: pronuncias, dicionarios: dicionariosAgrupados };
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

function buscarPalavraSimples($, dicionario) {
  var dataId = '';
  if(dicionario === 'Britânico') {
    dataId = 'cald4';
  } else if(dicionario === 'Americano') {
    dataId = 'cacd';
  }

  var el_dicBritanico = $('div[data-id="' + dataId + '"]');
  var el_classesGramaticais = $(el_dicBritanico).find('.entry-body__el');

  var classesGramaticais = [];
  for (let i = 0; i < el_classesGramaticais.length; i++) {

    // Header
    var classeGramatical = $(el_classesGramaticais[i]).find('.pos-header .pos.dpos').first().text().trim();

    var pronuncias = [];
    var el_regioes = $(el_classesGramaticais[i]).find('.pos-header .dpron-i');
    for (let j = 0; j < el_regioes.length; j++) {
      var regiao = $(el_regioes[j]).find('.region').text().trim();
      var pronuncia = $(el_regioes[j]).find('.pron').text().trim();

      pronuncias.push({classeGramatical: classeGramatical, regiao: regiao, pronuncia: pronuncia});
    }

    // Body
    var definicoes = [];
    var el_definicoes = $(el_classesGramaticais[i]).find('.def-block');
    for (let j = 0; j < el_definicoes.length; j++) {
      var definicao = $(el_definicoes[j]).find('.ddef_h .def').text().trim();

      if(!definicao)
        continue;

      var exemplos = [];
      var el_exemplos = $(el_classesGramaticais[i]).find('.examp');
      for (let n = 0; n < el_exemplos.length; n++) {
        var exemplo = $(el_exemplos[n]).text().trim();
  
        if(exemplo)
          exemplos.push(exemplo);
      }
      var id = ((+new Date) + Math.random()* 100).toString(32);
      definicoes.push({id: id, classeGramatical: classeGramatical, definicao: definicao, exemplos: exemplos});

    }

    classesGramaticais.push({classeGramatical: classeGramatical, pronuncias: pronuncias, definicoes: definicoes});
  }

  return { dicionario: dicionario, classesGramaticais: classesGramaticais };
}