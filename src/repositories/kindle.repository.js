'use strict';

const puppeteer = require('puppeteer');

exports.buscar = async palavra => {
  palavra = palavra.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  var palavraBusca = palavra.replaceAll(' ', '+');

  const browser = await puppeteer.launch({
    headless: true,
    //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8' });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

  await page.goto('https://read.amazon.com/notebook', { waitUntil: 'networkidle0' });


  await page.type('#ap_email', 'antoniocss19@gmail.com');
  await page.type('#ap_password', 'antonio.19101996');

  await Promise.all([
    page.click('#signInSubmit'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });

  var listaHighlights = await page.evaluate(async () => {

    var listaExclusoes = [
      "The Art of Communicating",
      // "O código da inteligência: Inteligência socioemocional aplicada (Portuguese Edition)",
      "Soft Skills for Hard People: A Practical Guide to Emotional Intelligence for Rational Leaders",
      "Thinking, Fast and Slow",
      "Never Split the Difference: Negotiating As If Your Life Depended On It",
      "The Richest Man in Babylon",
      "The Art of War",
      "Level 5: The Body KPF with Integrated Audio (Pearson English Graded Readers)",
      "Mais Esperto que o Diabo: O mistério revelado da liberdade e do sucesso (Portuguese Edition)",
      "Inteligência emocional: A teoria revolucionária que redefine o que é ser inteligente (Portuguese Edition)",
      "Como convencer alguém em 90 segundos (Portuguese Edition)",
    ];
    var pararWhile = false
    var livros = $('.kp-notebook-library-each-book .a-declarative');
    var listaHighlights = [];

    // livros = [livros[0]];

    function clicarLivro(indexLivros) {
      if (indexLivros >= livros.length) {
        pararWhile = true;
        console.log("Fim clicarLivro");
        return;
      }

      console.log("Buscando mais um livro " + indexLivros);
      livros[indexLivros].click();

      pegarAnotacoes(indexLivros);
    }

    function pegarAnotacoes(indexLivros) {
      setTimeout(function (indexLivros) {
        var contagem = $('#kp-notebook-highlights-count').text();
        var highlights = $('#kp-notebook-annotations > div');

        if (contagem !== '' && contagem !== '--' && highlights) {

          var nomeLivro = $('.a-column.a-span5 > h3').text();
          console.log(nomeLivro);
          if (listaExclusoes.includes(nomeLivro)) {
            console.log("Livro Ignorado: " + nomeLivro);
            clicarLivro(++indexLivros);
            return;
          }

          var item = { nomeDoLivro: nomeLivro, highlights: [] };

          for (let index = 0; index < highlights.length; index++) {
            var highlight = $(highlights[index]).find('span[id="highlight"]').text();
            var note = $(highlights[index]).find('span[id="note"]').text();
            var color = $(highlights[index]).find('span[id="annotationHighlightHeader"]').text().split(' ')[0];
            var location = $(highlights[index]).find('input[id="kp-annotation-location"]').attr('value');

            item.highlights.push({ "location": location, "color": color, "highlight": highlight, "note": note });
          }

          listaHighlights.push(item);

          clicarLivro(++indexLivros);
          return;
        }
        pegarAnotacoes(indexLivros);
      }, 500, indexLivros);
    }

    clicarLivro(0);

    while (!pararWhile) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("While");
    }

    console.log("Fim do processamento");

    return listaHighlights;

  });

  console.log(listaHighlights);

  await browser.close();


  var listaAnotacoes = '';
  for (let i = 0; i < listaHighlights.length; i++) {
    const element = listaHighlights[i];
    
    var anotacoes = `${element.nomeDoLivro}\u000A\u000A`;
    for (let x = 0; x < element.highlights.length; x++) {
      const highlight = element.highlights[x];

      anotacoes += `- ${highlight.highlight}\u000A`;
      anotacoes += `#${highlight.note}\u000A`;
    }

    listaAnotacoes += '@@@@@@@@@@@@@@@@@@@@@@@@';
    listaAnotacoes += anotacoes;
  }


  return listaHighlights;
}
