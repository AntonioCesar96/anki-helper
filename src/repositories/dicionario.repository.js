'use strict';

const imagemRepository = require('./h/imagem.repository');
const contextRepository = require('./h/context.repository');
const cambridgeRepository = require('./h/cambridge.repository');
const oxfordRepository = require('./h/oxford.repository');

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

exports.buscarDefinicaoOxford = async palavra => {
  var retorno = await oxfordRepository.buscarDefinicaoOxford(palavra)
  return retorno;
}
