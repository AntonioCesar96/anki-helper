'use strict';

const repository = require('../repositories/dicionario.repository');

exports.buscarPalavra = async (req, res, next) => {

  try {
    var palavra = req.query.palavra;
    
    var cambridge = await repository.buscarDefinicaoCambridge(palavra);
    var context = await repository.buscarTraducoesContext(palavra);
    var imagens = await repository.buscarImagens(palavra);

    var retorno = {};
    retorno.palavra = palavra;
    retorno.traducoes = context;
    retorno.imagens = imagens;
    retorno.dicionarios = cambridge;

    res.status(200).send(retorno);
  } catch (err) {
    handleError(res);
  }
};

function handleError(res) {
  res.status(500).send({
    message: 'Falha ao processar sua requisição'
  });
}
