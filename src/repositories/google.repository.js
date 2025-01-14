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
    var pronuncia2 = $('.TQ7enb').text();
    var estresse = $('.TQ7enb .BBwThe').text();

    if (pronuncia != '') {
      pronuncia = pronuncia.replaceAll(estresse, `<b>${estresse}</b>`)
      pronuncia2 = pronuncia2.replaceAll(estresse, `${estresse.toUpperCase()}`);
    }

    var pron = { palavra: palavras[i], pronuncia: pronuncia, pronuncia2: pronuncia2 };
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
    var el_freq = document.querySelector('.entry-content .figure');
    var freq = el_freq.textContent.trim();

    for (let i = 0; i < el_sinonimos1.length; i++) {
      if (!el_sinonimos1[i]) {
        continue;
      }

      var sin = el_sinonimos1[i].textContent.trim();

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
    /*
        var nouns = traducoes.filter(x => [...x.classList].some(y => y === 'n')).slice(0, 6);
        var verbs = traducoes.filter(x => [...x.classList].some(y => y === 'v')).slice(0, 3);
        var adjs = traducoes.filter(x => [...x.classList].some(y => y === 'adj')).slice(0, 3);
        var advs = traducoes.filter(x => [...x.classList].some(y => y === 'adv')).slice(0, 3);
        var noPos = traducoes.filter(x => [...x.classList].some(y => y === 'no-pos')).slice(0, 3);
        var indications = traducoes.filter(x => [...x.classList].some(y => y === 'indication')).slice(0, 3);
        var mobileHidden = traducoes.filter(x => [...x.classList].some(y => y === 'mobile-hidden')).slice(0, 3);
    
        traducoes = [];
        traducoes.push(...nouns);
        traducoes.push(...verbs);
        traducoes.push(...adjs);
        traducoes.push(...advs);
        traducoes.push(...noPos);
        traducoes.push(...indications);
        traducoes.push(...mobileHidden);
    */
    traducoes = traducoes.sort(function (a, b) { return b.getAttribute("data-freq") - a.getAttribute("data-freq") });

    var lista = [];

    if (!traducoes) {
      return lista;
    }

    for (let i = 0; i < traducoes.length; i++) {

      var traducao = traducoes[i].querySelector('.display-term').textContent.trim();
      if (traducao === '') {
        continue;
      }

      traducoes[i].click();
      var freq = traducoes[i].getAttribute("data-freq");
      var classes = [...traducoes[i].classList]
      var tipo = 0;
      var tipoDesc = '';
      if (classes.some(y => y === 'v')) {
        tipo = 1;
        tipoDesc = 'verb';
      } else if (classes.some(y => y === 'n')) {
        tipo = 2;
        tipoDesc = 'noun';
      } else if (classes.some(y => y === 'adj')) {
        tipo = 3;
        tipoDesc = 'adje';
      } else if (classes.some(y => y === 'adv')) {
        tipo = 4;
        tipoDesc = 'adve';
      } else if (classes.some(y => y === 'no-pos')) {
        tipo = 5;
        tipoDesc = 'nopo';
      } else if (classes.some(y => y === 'indication')) {
        tipo = 6;
        tipoDesc = 'indi';
      }

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

      lista.push({
        freq: freq, tipo: tipo, palavraIngles: pIngles,
        palavraPortugues: traducao, sinonimos: `${tipoDesc}_${freq} ` + sinonimos1
      });
    }

    lista = lista.sort(function (a, b) { return a.tipo - b.tipo || b.freq - a.freq; });

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


exports.obterContextTraducoes1 = async palavras => {

  var palavraIngles = palavras[0];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.goto('https://context.reverso.net/traducao/ingles-portugues/' + palavraIngles);

  var traducoesTermos2 = await page.evaluate(async (pIngles) => {
    // await new Promise(resolve => setTimeout(resolve, 1500));

    var traducoes = [...document.querySelectorAll('#translations-content .translation')];
    traducoes = traducoes.sort(function (a, b) { return b.getAttribute("data-freq") - a.getAttribute("data-freq") });

    var lista = [];
    if (!traducoes) {
      return lista;
    }

    var traducoesTermos = "";
    for (let i = 0; i < traducoes.length; i++) {

      var traducao = traducoes[i].querySelector('.display-term').textContent.trim();
      if (traducao === '') {
        continue;
      }

      traducoesTermos += `${traducao}, `
    }

    return traducoesTermos;
  }, palavraIngles);

  await browser.close();

  return [{ palavraIngles: palavraIngles, traducoes: traducoesTermos2 }];
}

exports.obterContextTraducoes = async palavras => {

  var lista = [];
  for (let i = 0; i < palavras.length; i++) {
    let palavraBusca = palavras[i];

    var command = 'curl -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36" "https://context.reverso.net/traducao/ingles-portugues/' + palavraBusca + '"';

    const { stdout, stderr } = await exec(command, { maxBuffer: 1024 * tamanhoBuffer })

    const $ = cheerio.load(stdout);

    var traducoes = [...$('#translations-content .translation')];
    traducoes = traducoes.sort(function (a, b) { return $(b).data("freq") - $(b).data("freq") });

    var lista = [];
    if (!traducoes) {
      return lista;
    }

    var traducoesTermos = "";
    var traducoesTermosComCategoria = [];
    for (let i = 0; i < traducoes.length; i++) {

      var traducao = $(traducoes[i]).text().trim();
      if (traducao === '') {
        continue;
      }

      const classValue = $(traducoes[i]).attr('class');
      const classes = classValue.split(' ');

      var tipo = 0;
      var tipoDesc = '';
      if (classes.some(y => y === 'v')) {
        tipo = 1;
        tipoDesc = 'verb';
      } else if (classes.some(y => y === 'n')) {
        tipo = 2;
        tipoDesc = 'noun';
      } else if (classes.some(y => y === 'adj')) {
        tipo = 3;
        tipoDesc = 'adje';
      } else if (classes.some(y => y === 'adv')) {
        tipo = 4;
        tipoDesc = 'adve';
      } else if (classes.some(y => y === 'no-pos')) {
        tipo = 5;
        tipoDesc = 'nopo';
      } else if (classes.some(y => y === 'indication')) {
        tipo = 6;
        tipoDesc = 'indi';
      }

      traducao = traducao.replace(' mf', '').replace(' f', '').replace(' m', '');

      traducoesTermosComCategoria.push({ traducao: traducao, tipo: tipo, tipoDesc: tipoDesc });

      if (traducoesTermos == "") {
        traducoesTermos = `${traducao}`;
        continue;
      }
      traducoesTermos += `, ${traducao}`;
    }

    // lista.push(traducoesTermos);
  }

  const traducoesPorTipo = {};

  // Itera sobre os dados e agrupa as traduções por tipo
  traducoesTermosComCategoria.forEach((item) => {
    if (!traducoesPorTipo[item.tipoDesc]) {
      traducoesPorTipo[item.tipoDesc] = [];
    }
    traducoesPorTipo[item.tipoDesc].push(item.traducao);
  });

  // Cria a string no formato desejado
  let resultado = '';
  for (const tipo in traducoesPorTipo) {
    resultado += `<b>${tipo}:</b> ${traducoesPorTipo[tipo].join(', ')}<br/><hr>`;
  }

  if (resultado) {
    resultado = resultado.substring(0, resultado.length - 4)
  }

  lista.push(resultado);

  return lista;
}