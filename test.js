'use strict'

const util = require('util');
const test = require('tape');

const convert = require('./index');


test('ERC20', { objectPrintDepth: 20 }, function (t) {
  const abi = require('./node_modules/openzeppelin-solidity/build/contracts/ERC20.json').abi;
  const expected = require('./test/ERC20');
  const actual = convert(abi);
  t.deepEqual(actual, expected, 'Converts all function inputs and outputs without options');
  t.end();
});
