#!/usr/bin/env bash

dir=`realpath $(dirname "$0")`

#make sure everything is pushed
git push && \

#validate that everything is committed (to make sure we're not messing with open work with updatePackage)
git diff --exit-code && \

#make sure latest packages are installed
$dir/updatePackage.sh ./pub && \

#validate that everything is committed
git diff --exit-code && \

#buildAndTest
$dir/buildAndTest.sh