#!/bin/bash

set -ev

aws s3 sync ./out $BUCKET --delete
