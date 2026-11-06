#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete --exclude '*.txt' --exclude '*.md'

cd out

# The filtered syncs exist only to add charset=utf-8; sync already picks text/plain and
# text/markdown from the extension. The main sync excludes these files so nothing uploads twice.
aws s3 sync . "$BUCKET" --delete --exclude '*' --include '*.txt' \
    --content-type 'text/plain; charset=utf-8'
aws s3 sync . "$BUCKET" --delete --exclude '*' --include '*.md' \
    --content-type 'text/markdown; charset=utf-8'

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
