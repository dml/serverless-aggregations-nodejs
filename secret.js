'use strict';

const AWS = require('aws-sdk');
const kms = new AWS.KMS({
  apiVersion: '2014-11-01',
  region: process.env.AWS_REGION
});

class Secret {
  static decrypt(...params) {
    try {
      return Promise
        .all(params.map(e => {
          return kms.decrypt({'CiphertextBlob' : Buffer(e, 'base64')}).promise();
        }))
        .then(args => {
          return args.map(e => { return e.Plaintext.toString('ascii') });
        })
    } catch(e) {
      return Promise.reject(new Error('Unable to unpack KMS secrets properly'));
    }
  }
}

module.exports = Secret;
