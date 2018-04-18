#! /bin/sh

ACCOUNT_ID=$ACCOUNT_STAGING_ID
[ -f /usr/src/deployment/inc/assume_role.sh ] && . /usr/src/deployment/inc/assume_role.sh

assume_role "$ACCOUNT_ID" "DeployerRole"

aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID --paths '/*'
