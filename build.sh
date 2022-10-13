#!/bin/sh
DIR=web-ext-artifacts
OUT=$DIR/youtube-2x-toggle-$VERSION.zip
mkdir -p $DIR
rm -f $OUT
zip -r -FS $OUT manifest.json LICENSE main.js icons/ images/
