#!/usr/bin/env bash
dir=`realpath $(dirname "$0")`

$dir/validatePublicationReadiness.sh && \

#bump version and store in variable
pushd ./pub && \
newVersion=$(npm version "$1") && \
popd && \

#commit package.json with new version number
git add . && \
git commit -m "version bumped to $newVersion" && \

#create a tag
git tag -a "$newVersion" -m "$newVersion" && \
git push && \

#publish
pushd ./pub && \
npm publish && \
popd
