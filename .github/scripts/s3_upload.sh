#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

set -euo pipefail

# Extract bucket name and prefix
BUCKET_NAME=$(echo "$BUCKET" | sed -E 's|^s3://([^/]+).*|\1|')
PREFIX=$(echo "$BUCKET" | sed -E 's|^s3://[^/]+/?||')

echo "Cleaning up extensionless files in: s3://$BUCKET_NAME/$PREFIX"

# Get extensionless files under the prefix
aws s3api list-objects-v2 \
  --bucket "$BUCKET_NAME" \
  --prefix "$PREFIX" \
  --query "Contents[?contains(Key, '.') == \`false\`].Key" \
  --output text |
while read -r key; do
  if [[ -n "$key" ]]; then
    echo "Deleting legacy file: $key"
    aws s3 rm "s3://$BUCKET_NAME/$key"
  fi
done