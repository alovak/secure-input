#! /bin/sh
temp_role=$(aws sts assume-role \
                    --role-arn arn:aws:iam::$ACCOUNT_ID:role/DeployerRole \
					--role-session-name "Deployer-Session" \
					--duration-seconds 900)

export AWS_ACCESS_KEY_ID=$(echo $temp_role | jq -r .Credentials.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq -r .Credentials.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $temp_role | jq -r .Credentials.SessionToken)

echo "sync s3://$S3_BUCKET/ with dist/*"

aws s3 sync dist s3://$S3_BUCKET --delete
