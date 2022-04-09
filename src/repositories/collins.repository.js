'use strict';

const puppeteer = require('puppeteer');

exports.buscarDefinicaoCollins = async palavra => {
  var palavraBusca = palavra.replaceAll(' ', '-');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

  await page.goto('https://www.collinsdictionary.com/us/dictionary/english/' + palavraBusca);

  var definicoes = await page.evaluate(async () => {

    var definicoes = [];
    var el_definicoes = document.querySelectorAll('.Cob_Adv_Brit .def');

    if (!el_definicoes || el_definicoes.length == 0) {
      el_definicoes = document.querySelectorAll('.Cob_Adv_US .def');
    }

    if (!el_definicoes || el_definicoes.length == 0) {
      el_definicoes = document.querySelectorAll('.Large_US_Webster .def');
    }

    if (!el_definicoes || el_definicoes.length == 0) {
      el_definicoes = document.querySelectorAll('.Penguin .def');
    }

    if (!el_definicoes || el_definicoes.length == 0) {
      el_definicoes = document.querySelectorAll('.Collins_Eng_Dict .def');
    }

    for (let j = 0; j < el_definicoes.length; j++) {
      var definicao = el_definicoes[j].textContent.trim();

      if (!definicao)
        continue;

      definicoes.push({ definicao: definicao, exemplos: [] });
    }

    return definicoes;
  });

  await browser.close();

  return definicoes;
}
