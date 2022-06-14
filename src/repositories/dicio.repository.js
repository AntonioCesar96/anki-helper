'use strict';

const puppeteer = require('puppeteer');

exports.buscarDefinicaoGoogle = async palavra => {
  palavra = palavra.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  var palavraBusca = palavra.replaceAll(' ', '+');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8' });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

  await page.goto('https://www.dicio.com.br/' + palavraBusca);

  var definicoes = await page.evaluate(async () => {

    let definicoes = [];
    let el_sinonimos = document.querySelectorAll('.adicional.sinonimos');
    for (let j = 0; j < el_sinonimos.length; j++) {
      let definicao = el_sinonimos[j].textContent.trim();

      definicoes.push({ definicao: definicao, exemplos: [] });
    }

    let el_significados = document.querySelectorAll('.significado span');
    for (let j = 0; j < el_significados.length; j++) {
      let definicao = el_significados[j].textContent.trim();

      definicoes.push({ definicao: definicao, exemplos: [] });
    }

    let el_exemplos = document.querySelectorAll('.frases .frase');
    for (let j = 0; j < el_exemplos.length; j++) {
      let definicao = el_exemplos[j].textContent.trim();

      definicoes.push({ definicao: '- ' + definicao, exemplos: [] });
    }

    /*
    if (el_definicoes && el_definicoes.length > 0) {
      for (let j = 0; j < el_definicoes.length; j++) {
        let definicao = el_definicoes[j].textContent.trim();

        if (!definicao)
          continue;

        definicoes.push({ definicao: definicao, exemplos: [] });
      }

      return definicoes;
    }
*/

    return definicoes;
    
  });

  await browser.close();

  return definicoes;
}
