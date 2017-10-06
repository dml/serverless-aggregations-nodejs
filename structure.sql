DROP TABLE IF EXISTS sls_test;

CREATE TABLE sls_test (
  label               varchar,
  event_date          date,
  volume              integer
)
DISTKEY(label)
SORTKEY(label, event_date);
