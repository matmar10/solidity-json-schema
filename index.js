'use strict';

const objectMapper = require('object-mapper');
const traverse = require('traverse');

const types = {

  // uint, int: synonyms for uint256, int256 respectively. For computing the function selector, uint256 and int256 have to be used.
  int: {
    // 'int256'
    type: 'integer',
    // TODO: max size
  },
  uint: {
    // 'uint256',
    type: 'integer',
  },

  // address: equivalent to uint160, except for the assumed interpretation and language typing.
  address: {
    type: 'string',
    pattern: '0x[a-fA-F0-9]{40}',
  },

  // fixed, ufixed: synonyms for fixed128x18, ufixed128x18
  fixed: {
    // fixed128x18
    type: 'number',
  },
  ufixed: {
    // ufixed128x18
    type: 'number',
  },

  bytes: {
    // bytes
    type: 'string',
  },

  // bool: equivalent to uint8 restricted to the values 0 and 1. For computing the function selector, bool is used.
  bool: {
    type: 'boolean',
  },

  string: {
    type: 'string',
  },
};

const typesRegex = {
  '^int\\d{1,3}$': types.int,
  '^uint\\d{1,3}$': types.uint,
  '^fixed\\d{1,3}x\\d{1,2}': types.fixed,
  '^ufixed\\d{1,3}x\\d{1,2}': types.ufixed,
  '^bytes\\d{1,3}': types.bytes
};

function mapType(type) {
  const mapped = types[type];
  if (mapped) {
    return mapped;
  }

  for (let pattern in typesRegex) {
    const exp = new RegExp(pattern);
    if (exp.test(type)) {
      return typesRegex[pattern];
    }
  }
  throw new Error(`Unsupported type: ${type}`);
}

function mapNode(node) {

  // this is for property getters
  if (!node.inputs.length && 1 === node.outputs.length) {
    const schema = mapType(node.outputs[0].type);
    if (!schema) {
      throw new Error('Undefined type: ' + node.outputs[0].type);
    }
    return schema;
  }

  // this is for property getters/setters

  const schema = {
    type: 'object',
    required: [],
    properties: {}
  };
  node.inputs.forEach(input => {
    const subSchema = mapType(input.type);
    if (!subSchema) {
      return;
    }
    let name = (input.name) ? input.name : input.type + 'Input';
    schema.properties[name] = subSchema;
    schema.required.push(name);
  });
  return schema;
}

function convert(abi, options) {
  const schema = {
    type: 'object',
    properties: {}
  };
  abi.forEach(function (node) {
    if ('constructor' === node.type) {
      schema.properties.constructor = mapNode(node);
      return;
    }
    if ('function' === node.type) {
      schema.properties[node.name] = mapNode(node);
    }
  });

  return schema;
}

module.exports = convert;
