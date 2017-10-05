'use strict';

process.env.REDSHIFT = 'connection string';

const sinon = require('sinon');
const assert = require('assert');
const proxyquire = require('proxyquire');

var connection = sinon.spy();
var pgPromise = (options) => {
  return (connectionString) => { return connection }
}

const handler = proxyquire('../../../services/vmt_terminals/handler', {
  'pg-promise' : pgPromise,

  '../../lib/secret.js' : {
    decrypt: () => { return Promise.resolve(['connstring']) }
  },
  '../../lib/redshift_copy.js' : {
    copy: (template, params) => { return Promise.resolve(); }
  }
});

const s3msg = {
  Records: [{
    s3: {
      bucket: {name: 'test-bucket-name'},
      object: {key: 'test123'}
    }
  }]
}

const sns = {
  Records: [{Sns: {Message: JSON.stringify(s3msg) }}]
}

describe('vmt_terminal - avro', function() {
  it.skip('should be successful', () => {
    var callback = sinon.spy();

    handler.avro(sns, {}, callback);

    assert.ok(callback.called);
  });
});
