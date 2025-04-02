#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

# Extract bucket name and prefix from full S3 URI
BUCKET_NAME=$(echo "$BUCKET" | sed -E 's|^s3://([^/]+).*|\1|')
PREFIX=$(echo "$BUCKET" | sed -E 's|^s3://[^/]+/?||')

echo "Cleaning up legacy extensionless files in bucket: $BUCKET_NAME, prefix: $PREFIX"

# Find and removve all extensionless files under the prefix
aws s3api list-objects --bucket "$BUCKET_NAME" --prefix "$PREFIX" --query "Contents[?contains(Key, '.') == \`false\`].Key" --output text |
while read -r key; do
  if [[ -n "$key" ]]; then
    echo "Deleting stale file: $key"
    aws s3 rm "s3://$BUCKET_NAME/$key"
  fi
done
