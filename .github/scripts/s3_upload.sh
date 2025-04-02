#!/bin/bash

set -e

aws s3 sync ./out $BUCKET --delete

# Upload all HTML files again but w/o an extention so that URLs like /welcome open the right page

cd out

find . -name '*.html' | sed 's|^\./||' | parallel -j 10 aws s3 cp {} $BUCKET/{/..} --content-type 'text/html'
