'use strict'

const util = require('util');
const convert = require('./index');

const abi = require('./../../Blossom/smartsukuk-dual-mudaraba/build/contracts/Token.json').abi;

const converted = convert(abi);
console.log(util.inspect(converted, { depth: null }));
