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

exports.salvarJson = async (req, res, next) => {

  try {
    console.log(req.body);

    var json = req.body;

    fs.writeFile(`cifra/index.json`, JSON.stringify(json, null, 4), function (err) {
      if (err) {
        return console.log(err);
      }

      console.log(`Index json cifra atualizado`);
    });

    res.status(200).send(json);

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
