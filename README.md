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

Create KMS key and encrypt secure sensitive variables

```

    aws kms create-key --description "your labmda creads key"

    aws kms encrypt \
      --key-id e1111111-bbbb-4444-8888-91d35d2c36e9 \
      --query CiphertextBlob \
      --plaintext "postgres://lambda:pa33@aaa.ccc.us-east-1.redshift.amazonaws.com:5439/db" \
      --output text

```


Setup environment variables

```

    export AWS_REGION=us-east-1
    export BUCKET=serverless-demo-bucket
    export LAMBDA_AWS_IAM_ROLE="arn:aws:iam::123456789012:role/myLambdaRole"
    export LAMBDA_AWS_IAM_KMS_ARN="arn:aws:kms:${AWS_REGION}:123456789012:key/e1111111-bbbb-4444-8888-91d35d2c36e9"
    export REDSHIFT_AWS_IAM_ROLE="arn:aws:iam::123456789012:role/myRedshiftRole"
    export REDSHIFT_TABLE=sls_test
    export REDSHIFT_CREDENTIALS="AQICAHhFdQh+21c5Zb2lrfTbwC2......KD+ikFoZOuNglk+s="

```


Setup service

```

    sls deploy -v

    aws s3 cp demo.csv s3://serverless-demo-bucket/

```


## Remove

```

    aws s3 rm s3://serverless-demo-bucket/demo.csv

    sls remove -v

```
