'use strict';

const pgp = require('pg-promise')();
const Secret = require('./secret.js');
const connection = Secret.decrypt(process.env.REDSHIFT_CREDENTIALS);

const successMessage = 'unload task has been completed';

const queryTemplate = `

  UNLOAD('

  WITH

  extracted AS (
    SELECT
        label
      , event_date
      , to_char(event_date, ''YYYY-MM'') AS mo
      , volume
    FROM \${table~}
  )

  ,

  accumulated AS (
    SELECT
        label
      , mo
      , max(volume) OVER(PARTITION BY label, mo) AS mx
      , min(volume) OVER(PARTITION BY label, mo) AS mi
      , avg(volume) OVER(PARTITION BY label, mo) AS av
      , row_number()
          OVER(PARTITION BY label, mo ORDER BY event_date)
            AS pos
    FROM extracted
  )

  SELECT
      label
    , mo
    , mx
    , mi
    , av

  FROM accumulated
  WHERE pos = 1
  ORDER BY 2, 1

  ')

  TO \${filename}
  CREDENTIALS \${credentials}
  DELIMITER ','
  PARALLEL OFF
  ALLOWOVERWRITE

`;



module.exports.main = (event, context, callback) => {
  var s3uri = `s3://${process.env.REPORT_BUCKET}/${process.env.REPORT_OBJECT}`;

  connection
    .then(args => {
      return pgp(args[0]);
    })
    .then(redshift => {
      return redshift.none(queryTemplate, {
        'table':        process.env.REDSHIFT_TABLE,
        'credentials':  `aws_iam_role=${process.env.REDSHIFT_AWS_IAM_ROLE}`,
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
