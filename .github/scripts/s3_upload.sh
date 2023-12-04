#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

# Upload all HTML files again but w/o an extention so that URLs like /welcome open the right page

cd out

for file in $(find . -name '*.html' | sed 's|^\./||'); do
    aws s3 cp ${file%} $BUCKET/${file%.*} --content-type 'text/html'
done