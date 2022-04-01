'use strict';

const cheerio = require('cheerio');
var util = require('util');
var exec = util.promisify(require('child_process').exec);

var tamanhoBuffer = 10000;

exports.buscarImagens = async palavra => {
  var palavraBusca = palavra.replaceAll(' ', '+')
  var command = 'curl -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36" "https://www.google.com/search?tbm=isch&q=' + palavraBusca + '"';

  const { stdout, stderr } = await exec(command, { maxBuffer: 1024 * tamanhoBuffer })

  const $ = cheerio.load(stdout);

  var imagens = [];
  var el_imagens = $('#islmp img');
  for (let i = 0; i < el_imagens.length; i++) {
    var dataSrc = $(el_imagens[i]).attr('data-src');
    if (dataSrc)
      imagens.push({ src: dataSrc });

  }

  return {
    key: "imagens",
    body: imagens
  };
}

exports.buscarPronuncias = async palavras => {

  var lista = [];
  for (let i = 0; i < palavras.length; i++) {
    const palavraBusca = palavras[i] + ' pronunciation';

    var command = 'curl -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36" "https://www.google.com/search?&q=' + palavraBusca + '"';

    const { stdout, stderr } = await exec(command, { maxBuffer: 1024 * tamanhoBuffer })

    const $ = cheerio.load(stdout);

    lista.push({ palavra: palavras[i], pronuncia: $('.TQ7enb').textContent });
  }

  return lista;
}
