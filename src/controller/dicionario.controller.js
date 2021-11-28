'use strict';

const repository = require('../repositories/dicionario.repository');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 0 }); // segundos

exports.buscarPalavra = async (req, res, next) => {

  try {
    var palavra = req.query.palavra;

    if (cache.has(palavra)) {
      return res.status(200).json(cache.get(palavra));
    }
    
    var cambridge = await repository.buscarDefinicaoCambridge(palavra);
    var context = await repository.buscarTraducoesContext(palavra);
    var imagens = await repository.buscarImagens(palavra);

    var retorno = {};
    retorno.palavra = palavra;
    retorno.traducoes = context;
    retorno.imagens = imagens;
    retorno.pronuncias = cambridge.pronuncias;
    retorno.dicionarios = cambridge.dicionarios;

    cache.set(palavra, retorno); 

    res.status(200).send(retorno);
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
