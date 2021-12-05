'use strict';

const imagemRepository = require('./h/imagem.repository');
const contextRepository = require('./h/context.repository');
const cambridgeRepository = require('./h/cambridge.repository');

exports.buscarImagens = async palavra => {
  var retorno = await imagemRepository.buscarImagens(palavra);
  return retorno;
}

exports.buscarTraducoesContext = async palavra => {
  var retorno = await contextRepository.buscarTraducoesContext(palavra)
  return retorno;
}

exports.buscarDefinicaoCambridge = async palavra => {
  var retorno = await cambridgeRepository.buscarDefinicaoCambridge(palavra)
  return retorno;
}

exports.buscarAudio = async palavra => {
  var retorno = await oxfordRepository.buscarAudio(palavra)
  return retorno;
}
