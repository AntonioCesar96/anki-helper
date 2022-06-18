'use strict';

const cheerio = require('cheerio');
var util = require('util');
var exec = util.promisify(require('child_process').exec);

const repository = require('../repositories/kindle.repository');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // segundos

const fs = require('fs');
const path = require('path');

var $ = require("jquery");


exports.buscar = async (req, res, next) => {

  try {
    var element = await repository.buscar("palavra");

    res.status(200).send(element);
  } catch (err) {
    handleError(res, err);
  }
};

exports.leitor = async (req, res, next) => {

  try {
    var ebookFile = obterConteudoArquivo('html/soft-skills', 'index1.html');
    var $ebookFile = cheerio.load(ebookFile);

    var todasImagens = $ebookFile('img');
    for (let i = 0; i < todasImagens.length; i++) {
      var splits = todasImagens[i].attribs.src.split('/');
      todasImagens[i].attribs.src = "http://localhost:3000/soft-skills/" + splits[splits.length - 1];
    }

    var filesCss = ['stylesheet.css', 'page_styles.css', 'calibreHtmlOutBasicCss.css'];

    var conteudoArquivosCss = [];
    for (let i = 0; i < filesCss.length; i++) {
      var css = obterConteudoArquivo('html/soft-skills', filesCss[i]);
      conteudoArquivosCss.push(css);
    }

    var ebook = {
      conteudo: $ebookFile('body').html(),
      conteudoArquivosCss: conteudoArquivosCss
    };

    res.status(200).send(ebook);

  } catch (err) {
    handleError(res, err);
  }
};

function obterConteudoArquivo(dir, name) {
  var filePath = path.join(dir, name);
  var buffer = fs.readFileSync(filePath, { encoding: 'utf8' });
  return buffer;
}

exports.salvarHtml = async (req, res, next) => {

  try {
    var html = req.body.innerHTML;

    var ebookFile = obterConteudoArquivo('html/soft-skills', 'index1.html');
    var $ebookFile = cheerio.load(ebookFile);

    $ebookFile('body').empty()
    $ebookFile('body').append(html);;

    var novoHtml = $ebookFile.html();
    fs.writeFile('html/soft-skills/index1.html', novoHtml, function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });

    var ebook = {
      conteudo: novoHtml
    };

    res.status(200).send(ebook);

  } catch (err) {
    handleError(res, err);
  }
};

function handleError(res, err) {
  res.status(500).send({
    message: 'Falha ao processar sua requisição',
    error: err.message,
    stack: err.stack
  });
}
