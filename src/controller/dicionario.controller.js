'use strict';

const repository = require('../repositories/dicionario.repository');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // segundos

exports.buscarPalavra = async (req, res, next) => {

  try {
    var palavra = req.query.palavra;

    if (cache.has(palavra)) {
      return res.status(200).json(cache.get(palavra));
    }
    
    const promises = [
      repository.buscarTraducoesContext(palavra),
      repository.buscarImagens(palavra),
      repository.buscarDefinicaoCambridge(palavra),
    // repository.buscarDefinicaoOxford(palavra),
    ];

    var retorno = {};
    
    var list = await Promise.all(promises);
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if(element.key === 'context') {
        retorno.traducoes = element.body.traducoes;
        retorno.sugestoes = element.body.sugestoes;
      } else if(element.key === 'imagens') {
        retorno.imagens = element.body;
      } else if(element.key === 'cambridge') {
        retorno.palavra = element.body.palavra;
        retorno.pronuncias = element.body.pronuncias;
        retorno.dicionarios = element.body.dicionarios;
      }
    }
    
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
