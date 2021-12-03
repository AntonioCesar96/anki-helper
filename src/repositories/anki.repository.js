'use strict';

const fetch = require('node-fetch');

exports.obterNomeDosDecks = async () => {

  var body = { action: "deckNames", version: 6 };

  const response = await fetch('http://localhost:8765', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  });

  const data = await response.json();
  return data;
}

exports.salvarNota = async nota => {

  await salvarAnexos(nota.anexos);

  var body = {
    action: "addNote",
    version: 6,
    params: {
      note: {
        deckName: nota.deckName,
        modelName: "Basice 4 Fields",
        fields: {
            Front: nota.front,
            Pronuncia: nota.pronuncia,
            Traducao: nota.traducao,
            Significado: nota.significado,
        },
        options: {
            allowDuplicate: false,
            duplicateScope: "deck",
            duplicateScopeOptions: {
                deckName: nota.deckName,
                checkChildren: false,
                checkAllModels: false
            }
        },
        tags: []
      }
    }
  }

  const response = await fetch('http://localhost:8765', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  });

  const data = await response.json();
  return data;
}

async function salvarAnexos(anexos) {
  if(anexos.length > 0) {
    for (let i = 0; i < anexos.length; i++) {
      const anexo = anexos[i];
      
      var bodyAnexo = {
        action: "storeMediaFile",
        version: 6,
        params: {
          filename: anexo.nome,
          url: anexo.url
        }
      };

      const response = await fetch('http://localhost:8765', {
        method: 'post',
        body: JSON.stringify(bodyAnexo),
        headers: {'Content-Type': 'application/json'}
      });

      const data = await response.json();
    }
  }
}
