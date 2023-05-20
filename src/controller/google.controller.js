'use strict';

const repository = require('../repositories/google.repository');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // segundos
const request = require("request-promise");
var fs = require('fs');

exports.buscarPalavra = async (req, res, next) => {

  try {

    var palavras = req.body;

    var lista = await repository.buscarPronuncias(palavras);
    res.status(200).send(lista);
  } catch (err) {
    console.log(err);
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

exports.obterContext = async (req, res, next) => {

  try {

    var palavraIngles = req.query.palavraIngles;
    var palavraPortugues = req.query.palavraPortugues;

    var listaFinal = [];

    var retorno2 = await repository.obterContext2(palavraIngles, palavraPortugues, 1);

    var existe = retorno2.find(x => x.palavraIngles == palavraIngles && x.palavraPortugues == palavraPortugues);

    if (existe) {
      retorno2 = retorno2.filter(x => x != existe);
      listaFinal.push(existe);
      listaFinal.push(...retorno2);
    } else {
      listaFinal.push(...retorno2);
    }

    res.status(200).send({ sinonimos: listaFinal });
  } catch (err) {
    console.log(err);
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


exports.obterImagem = async (req, res, next) => {

  try {

    var palavraIngles = req.query.palavraIngles;
    var palavraPortugues = req.query.palavraPortugues;

    var retorno = await repository.obterImagem(palavraIngles, 1);
    var retorno2 = await repository.obterImagem(palavraPortugues, 1);
    var retorno3 = await repository.obterImagem(palavraPortugues + ' significado', 1);

    res.status(200).send({ imagens: [retorno3, retorno, retorno2] });
  } catch (err) {
    console.log(err);
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



exports.obterPronunciationAudio = async (req, res, next) => {

  try {

    res.type('audio/mpeg');

    var request = require('request');
    var url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=' + req.query.palavra;
    request.get(url).pipe(res);

    //res.send(result);

  } catch (err) {
    console.log(err);
    handleError(res, err);
  }
};