#!/bin/bash

set -ev

# First, upload the new files w/o deleting the old ones
aws s3 sync . $BUCKET --exclude '.git/*' --exclude '.github/*'

# Second, upload them again but delete the old files this time
# This allows for a no-downtime deployment
aws s3 sync . $BUCKET --exclude '.git/*' --exclude '.github/*' --delete

# Finally, upload all HTML files again but w/o an extention so that URLs like /welcome open the right page
for file in $(find . -name '*.html' | sed 's|^\./||'); do
    aws s3 cp ${file%} $BUCKET/${file%.*} --content-type 'text/html' --exclude '.git/*' --exclude '.github/*'
done