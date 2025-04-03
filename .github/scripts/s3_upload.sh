#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

set -euo pipefail

cd out

MAX_CONCURRENCY=10
JOBS=0

find . -name index.html | while read -r index_file; do
  dir_path=$(dirname "$index_file")
  clean_path="${dir_path#./}"

  [[ "$clean_path" == "." ]] && continue

  aws s3 cp ${file%} $BUCKET/${file%.*} --content-type 'text/html'

  JOBS=$((JOBS + 1))

  # Control concurrency
  if [[ "$JOBS" -ge "$MAX_CONCURRENCY" ]]; then
    wait -n
    JOBS=$((JOBS - 1))
  fi
done

wait

cd -
