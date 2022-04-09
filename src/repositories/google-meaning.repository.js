'use strict';

const puppeteer = require('puppeteer');

exports.buscarDefinicaoGoogle = async palavra => {
  var palavraBusca = palavra.replaceAll(' ', '+');
  palavraBusca += '+meaning';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8' });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

  await page.goto('https://www.google.com/search?q=' + palavraBusca);

  var definicoes = await page.evaluate(async () => {

    let definicoes = [];
    let el_definicoes = document.querySelectorAll('.lr_container div[data-dobid="dfn"] span');

    if (el_definicoes && el_definicoes.length > 0) {
      for (let j = 0; j < el_definicoes.length; j++) {
        let definicao = el_definicoes[j].textContent.trim();

        if (!definicao)
          continue;

        definicoes.push({ definicao: definicao, exemplos: [] });
      }

      return definicoes;
    }

    var primeiroResultado = document.querySelector('div[data-attrid="wa:/description"]');
    if (primeiroResultado) {
      let definicao = primeiroResultado.textContent.trim();

      let definicoes = [];
      definicoes.push({ definicao: definicao, exemplos: [] });

      return definicoes;
    }

    return []
  });

  // await browser.close();

  return definicoes;
}
