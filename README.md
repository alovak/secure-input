# JS-SDK


## HTTPS on js.power.dev

Password for myCA.pem is **1234**

This is a how to for self signed certificates: https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/


## How to test pipeline locally

Don't forget that you need .env file with IAM user that can assume DeployerRole:

```
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=YYY
```

Then, to run deployment script:

> docker-compose run pipeline sh

check what we run in bitbucket-pipelines.yml step/script and reproduce here like:

> export ACCOUNT_ID=$ACCOUNT_STAGING_ID
> export AWS_DEFAULT_REGION=us-east-1
> export S3_BUCKET=cdn.powerpayments.tech
> ./scripts/s3_deploy.sh
