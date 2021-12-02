'use strict';

const cheerio = require('cheerio');
var util = require('util');
var exec = util.promisify(require('child_process').exec);

var tamanhoBuffer = 10000;

exports.buscarTraducoesContext = async palavra => {
  var palavraBusca = palavra.replaceAll(' ', '+')
  var command = 'curl -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36" https://context.reverso.net/traducao/ingles-portugues/' + palavraBusca

  const { stdout, stderr } = await exec(command, {maxBuffer: 1024 * tamanhoBuffer}) 
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

  var sugestoes = [];
  var el_sugestoes = $('#dym-content a');
  for (let i = 0; i < el_sugestoes.length; i++) {
    var sugestao = $(el_sugestoes[i]).text().trim();
    
    sugestoes.push(sugestao);
  }

  return {
    key: "context",
    body: { traducoes: traducoes, sugestoes: sugestoes }
  };
}
