#!/bin/bash

set -e

# Create a temporary directory to handle file restructuring
TEMP_DIR=$(mktemp -d)

# Copy all files to the temporary directory
cp -r ./out/* $TEMP_DIR

# Rename HTML files by removing the '.html' extension
find $TEMP_DIR -name '*.html' | while read file; do
    mv "$file" "${file%.html}"
done

# Function to determine content type
get_content_type() {
  case "$1" in
    *.html) echo "text/html";;
    *.js) echo "application/javascript";;
    *.css) echo "text/css";;
    *.json) echo "application/json";;
    *.png) echo "image/png";;
    *.jpg | *.jpeg) echo "image/jpeg";;
    *.gif) echo "image/gif";;
    *.svg) echo "image/svg+xml";;
    *.woff) echo "font/woff";;
    *.woff2) echo "font/woff2";;
    *) echo "binary/octet-stream";;
  esac
}

# Sync all files to S3 with correct content types
find $TEMP_DIR -type f | while read file; do
  content_type=$(get_content_type "$file")
  aws s3 cp "$file" "$BUCKET/${file#$TEMP_DIR/}" --content-type "$content_type"
done

# Clean up
rm -rf $TEMP_DIR