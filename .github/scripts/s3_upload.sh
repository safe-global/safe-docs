#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete

# Finally, upload all HTML files again but w/o an extention so that URLs like /welcome open the right page
for file in $(find ./out -name '*.html' | sed 's|^\./||'); do
    aws s3 cp ${file%} $BUCKET/${file%.*} --content-type 'text/html'
done