'use strict'

const util = require('util');
const test = require('tape');

const convert = require('./index');

const erc20Abi = require('./node_modules/openzeppelin-solidity/build/contracts/ERC20.json').abi;
const converted = JSON.stringify(convert(erc20Abi));
console.log(converted);
