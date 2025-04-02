#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

# Optional cleanup: remove extensionless top-level files (e.g. /welcome)
EXTENSIONLESS=$(aws s3api list-objects --bucket "$BUCKET_NAME" --prefix "$PREFIX" --query "Contents[?contains(Key, '.') == \`false\`].Key" --output text)

for key in $EXTENSIONLESS; do
  echo "Deleting stale file: $key"
  aws s3 rm "s3://$BUCKET_NAME/$key"
done