'use strict';

const cheerio = require('cheerio');
var util = require('util');
var exec = util.promisify(require('child_process').exec);

var tamanhoBuffer = 10000;

exports.buscarPronuncias = async palavras => {

  var lista = [];
  for (let i = 0; i < palavras.length; i++) {
    let palavraBusca = palavras[i] + '+pronunciation';
    palavraBusca = palavraBusca.replaceAll(' ', '+')

    var command = 'curl -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36" "https://www.google.com/search?&q=' + palavraBusca + '"';

    const { stdout, stderr } = await exec(command, { maxBuffer: 1024 * tamanhoBuffer })

    const $ = cheerio.load(stdout);

    var pronuncia = $('.TQ7enb').text();
    var estresse = $('.TQ7enb .BBwThe').text();

    if (pronuncia != '') {
      pronuncia = pronuncia.replaceAll(estresse, `<b>${estresse}</b>`)
    }

    var pron = { palavra: palavras[i], pronuncia: pronuncia };
    lista.push(pron);
  }

  return lista;
}
