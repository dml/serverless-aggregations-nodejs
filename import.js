'use strict';

const pgp = require('pg-promise')();
const Secret = require('./secret.js');
const connection = Secret.decrypt(process.env.REDSHIFT_CREDENTIALS);

const successMessage = 'copy task has been completed';

const queryTemplate = `
  COPY \${table~}
  FROM \${filename}
  IAM_ROLE '\${credentials^}'
  FORMAT AS CSV
`;



module.exports.main = (event, context, callback) => {
  var s3 = event.Records[0].s3;
  var s3uri = `s3://${s3.bucket.name}/${s3.object.key}`;

  connection
    .then(args => {
      return pgp(args[0]);
    })
    .then(redshift => {
      return redshift.none(queryTemplate, {
        'table':        process.env.REDSHIFT_TABLE,
        'credentials':  process.env.REDSHIFT_AWS_IAM_ROLE,
        'filename':     s3uri
      });
    })
    .then(() => {
      console.log(s3uri, successMessage);
      callback(null, successMessage);
    })
    .catch(callback)
    .then(() => {
      return pgp.end();
    });
};
