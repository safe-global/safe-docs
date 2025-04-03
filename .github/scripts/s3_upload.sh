#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

set -euo pipefail

echo "🔍 Finding exported index.html pages..."

cd out

# Create a temp empty file
TMPFILE=$(mktemp)
trap 'rm -f "$TMPFILE"' EXIT

find . -name index.html | while read -r index_file; do
  dir_path=$(dirname "$index_file")       # e.g., ./welcome
  clean_path="${dir_path#./}"             # strip leading ./

  # Skip root index.html (homepage)
  if [[ "$clean_path" == "." ]]; then
    continue
  fi

  redirect_key="${clean_path}"           # e.g., welcome
  redirect_target="/$clean_path/"        # e.g., /welcome/

  echo "↪️ Creating redirect object: /$redirect_key → $redirect_target"

  aws s3 cp "$TMPFILE" "$BUCKET/$redirect_key" \
    --website-redirect "$redirect_target" \
    --content-type "text/html"
done

cd -