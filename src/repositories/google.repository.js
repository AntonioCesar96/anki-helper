'use strict';

const cheerio = require('cheerio');
var util = require('util');
var exec = util.promisify(require('child_process').exec);
const puppeteer = require('puppeteer');
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


exports.obterContext1 = obterContext1Try

async function obterContext1Try(palavraIngles, palavraPortugues, contador) {
  try {

    var retorno = await obterContext1(palavraIngles, palavraPortugues);
    return retorno;
  } catch (err) {
    console.log(`obterContextTry1 Erro na ${contador} tentativa da palavra ${palavraIngles}`);
    console.log(err);

    var retorno = await obterContext1Try(palavraIngles, palavraPortugues, ++contador);
    return retorno;
  }
}

async function obterContext1(palavraIngles, palavraPortugues) {
  var palavraIngles2 = palavraIngles.replaceAll(' ', '+');
  var palavraPortugues2 = palavraPortugues.replaceAll(' ', '+');

  var palavraBusca = `${palavraIngles2}#${palavraPortugues2}`

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.goto('https://context.reverso.net/traducao/ingles-portugues/' + palavraBusca);

  var sinonimos = await page.evaluate(async (pIngles) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    var sinonimos1 = '';
    var el_sinonimos1 = document.querySelectorAll('.reverse-search-content .translation');

    for (let i = 0; i < el_sinonimos1.length; i++) {
      if (!el_sinonimos1[i]) {
        continue;
      }

      var sin = el_sinonimos1[i].textContent.trim();
      var freq = el_sinonimos1[i].getAttribute("data-freq");

      if (sin === pIngles) {
        continue;
      }

      if (sinonimos1 === '') {
        sinonimos1 = `freq: ${freq} - ${sin}`;
        continue;
      }
      sinonimos1 += ', ' + sin;
    }

    return sinonimos1;
  }, palavraIngles);

  await browser.close();

  return [{ palavraIngles: palavraIngles, palavraPortugues: palavraPortugues, sinonimos: sinonimos }];
}

exports.obterContext2 = obterContext2Try

async function obterContext2Try(palavraIngles, palavraPortugues, contador) {
  try {

    var retorno = await obterContext2(palavraIngles, palavraPortugues);
    return retorno;
  } catch (err) {
    console.log(`obterContext2Try1 Erro na ${contador} tentativa da palavra ${palavraIngles}`);
    console.log(err);

    var retorno = await obterContext2Try(palavraIngles, palavraPortugues, ++contador);
    return retorno;
  }
}

async function obterContext2(palavraIngles, palavraPortugues) {
  var palavraIngles2 = palavraIngles.replaceAll(' ', '+');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.goto('https://context.reverso.net/traducao/ingles-portugues/' + palavraIngles2);

  var sinonimos = await page.evaluate(async (pIngles) => {

    var traducoes = [...document.querySelectorAll('#translations-content .translation')];

    var nouns = traducoes.filter(x => [...x.classList].some(y => y === 'n')).slice(0, 6);
    var verbs = traducoes.filter(x => [...x.classList].some(y => y === 'v')).slice(0, 3);
    var adjs = traducoes.filter(x => [...x.classList].some(y => y === 'adj')).slice(0, 3);
    var advs = traducoes.filter(x => [...x.classList].some(y => y === 'adv')).slice(0, 3);
    var noPos = traducoes.filter(x => [...x.classList].some(y => y === 'no-pos')).slice(0, 3);
    var indications = traducoes.filter(x => [...x.classList].some(y => y === 'indication')).slice(0, 3);

    traducoes = [];
    traducoes.push(...nouns);
    traducoes.push(...verbs);
    traducoes.push(...adjs);
    traducoes.push(...advs);
    traducoes.push(...noPos);
    traducoes.push(...indications);

    traducoes = traducoes.sort(function (a, b) { return b.getAttribute("data-freq") - a.getAttribute("data-freq") });

    var lista = [];

    if (!traducoes) {
      return lista;
    }

    for (let i = 0; i < traducoes.length; i++) {

      var traducao = traducoes[i].textContent.trim();

      traducoes[i].click();
      var freq = traducoes[i].getAttribute("data-freq");

      await new Promise(resolve => setTimeout(resolve, 1500));

      var sinonimos1 = '';
      var el_sinonimos1 = document.querySelectorAll('.reverse-search-content .translation');

      for (let k = 0; k < el_sinonimos1.length; k++) {
        if (!el_sinonimos1[k]) {
          continue;
        }

        var sin = el_sinonimos1[k].textContent.trim();

        if (sinonimos1 === '') {
          sinonimos1 = sin;
          continue;
        }
        sinonimos1 += ', ' + sin;
      }

      lista.push({ palavraIngles: pIngles, palavraPortugues: traducao, sinonimos: sinonimos1 + ` - freq: ${freq}` });
    }

    return lista;
  }, palavraIngles);

  await browser.close();

  return sinonimos != null ? sinonimos : [];
}


exports.obterImagem = obterImagemTry

async function obterImagemTry(palavra, contador) {
  try {
    var retorno = await obterImagem(palavra);
    return retorno;
  } catch (err) {
    console.log(`obterImagemTry1 Erro na ${contador} tentativa da palavra ${palavra}`);
    console.log(err);

    var retorno = await obterImagemTry(palavra, ++contador);
    return retorno;
  }
}

async function obterImagem(palavra) {
  palavra = palavra.replaceAll(' ', '+');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.goto('https://www.google.com/search?tbm=isch&q=' + palavra);

  var nomeImagem = palavra + '.jpg';
  await page.screenshot({
    path: 'imagens/' + nomeImagem, type: 'jpeg',
    clip: { width: 500, height: 180, x: 15, y: 200 },
  });

  await browser.close();

  return 'http://localhost:3000/' + nomeImagem;
}
