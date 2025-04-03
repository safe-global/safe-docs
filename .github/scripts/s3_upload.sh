#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

set -euo pipefail

echo "🔍 Finding exported index.html pages..."

cd out

# Find all index.html files
find . -name index.html | while read -r index_file; do
  dir_path=$(dirname "$index_file")       # e.g., ./welcome
  clean_path="${dir_path#./}"             # strip leading ./

  # Skip root index.html (homepage)
  if [[ "$clean_path" == "." ]]; then
    continue
  fi

  # Build S3 key for redirect object (e.g., welcome)
  redirect_key="${clean_path}"

  # Build redirect target (e.g., /welcome/)
  redirect_target="/$clean_path/"

  echo "↪️ Creating redirect object for /$redirect_key → $redirect_target"

  # Upload zero-byte object with redirect
  aws s3 cp /dev/null "$BUCKET/$redirect_key" \
    --website-redirect "$redirect_target" \
    --content-type "text/html"
done

cd -