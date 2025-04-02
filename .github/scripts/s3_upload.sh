#!/bin/bash

set -e

# Create a temporary directory to handle renaming
TEMP_DIR=$(mktemp -d)

# Copy all files including HTML to the temporary directory
cp -r ./out/* $TEMP_DIR

# Rename HTML files by removing the '.html' extension
find $TEMP_DIR -name '*.html' | while read file; do
    mv "$file" "${file%.html}"
done

# Sync all files from the temporary directory to S3
aws s3 sync $TEMP_DIR $BUCKET --delete --content-type 'text/html' --exact-timestamps

# Remove the temporary directory
rm -rf $TEMP_DIR
