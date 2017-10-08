# AWS Lambda

AWS Lambda Example with NodeJS codebase


## Reference

- [serverless](https://serverless.com/framework/docs/providers/aws/guide/intro/)
- [packaging plugin](https://github.com/nfour/serverless-build-plugin/)


## Setup

Install NodeJS then install requirements

```
npm install
```


## Deploy

1. Create VPC network and subnets. Capture security group id and subnet ids.

2. Add [S3 Endpoint](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-endpoints.html) into your VPC network

3. Create Redshift cluster and target table.

```
    export PGHOST=dbname.cccccccccc.us-east-1.redshift.amazonaws.com
    export PGPORT=5439
    export PGUSER=lambda
    export PGPASSWORD=pass
    export PGDATABASE=dbname

    cat structure.sql | psql -e
```

4. Setup AWS Lambda user

```
    CREATE GROUP data_loaders;
    CREATE USER lambda PASSWORD 'pa33' IN GROUP data_loaders;
    GRANT USAGE ON SCHEMA public TO GROUP data_loaders;
    GRANT INSERT ON ALL TABLES IN SCHEMA PUBLIC TO GROUP data_loaders;
    GRANT SELECT ON ALL TABLES IN SCHEMA PUBLIC TO GROUP data_loaders;
```

5. Create KMS key and encrypt secure sensitive variables

```
    aws kms create-key --description "your labmda creads key"

    aws kms encrypt \
      --key-id e1111111-bbbb-4444-8888-91d35d2c36e9 \
      --query CiphertextBlob \
      --plaintext "postgres://lambda:pa33@aaa.ccc.us-east-1.redshift.amazonaws.com:5439/db" \
      --output text
```

6. Setup environment variables

```

    export AWS_REGION=us-east-1
    export BUCKET=serverless-demo-bucket
    export VPC_SECUIRY_GROUP_ID=sg-bbb99999
    export VPC_SUBNET_FIRST_ID=subnet-abcd0001
    export VPC_SUBNET_SECOND_ID=subnet-abcd0002
    export LAMBDA_AWS_IAM_ROLE="arn:aws:iam::123456789012:role/myLambdaRole"
    export LAMBDA_AWS_IAM_KMS_ARN="arn:aws:kms:${AWS_REGION}:123456789012:key/e1111111-bbbb-4444-8888-91d35d2c36e9"
    export REDSHIFT_AWS_IAM_ROLE="arn:aws:iam::123456789012:role/myRedshiftRole"
    export REDSHIFT_TABLE=sls_test
    export REDSHIFT_CREDENTIALS="AQICAHhFdQh+21c5Zb2lrfTbwC2......KD+ikFoZOuNglk+s="

```

7. Deploy lambda and load CSV sample

```
    sls deploy -v
    node generate.js
    aws s3 cp demo.csv s3://serverless-demo-bucket/input/
```

8. Now aggregation lambda might be executed along a cron job

```
    sls invoke -f aggregate -log
```

this produces a single report

```
    aws s3 cp s3://serverless-demo-bucket/output/report.000 . && \
        mv report.000 report.csv && \
        open report.csv
```


## Remove

```
    aws s3 rm s3://serverless-demo-bucket/input/demo.csv
    aws s3 rm s3://serverless-demo-bucket/output/report.000
    sls remove -v
```
