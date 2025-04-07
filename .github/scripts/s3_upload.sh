#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

cd out

function parallel_limit {
    local max="$1"
    while (( $(jobs -rp | wc -l) >= max )); do
        sleep 0.1
    done
}

export BUCKET  

MAX_JOBS=10

find . -name '*.html' -print0 | while IFS= read -r -d '' file; do
    filepath="${file#./}"
    noext="${filepath%.html}"
    
    parallel_limit "$MAX_JOBS"

    aws s3 cp "$filepath" "$BUCKET/$noext" --content-type 'text/html' &
done

wait
