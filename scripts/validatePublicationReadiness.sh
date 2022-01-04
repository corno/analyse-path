#!/usr/bin/env bash

dir=`realpath $(dirname "$0")`

#validate that everything is committed
git diff --exit-code && \

#make sure everything is pushed
git push && \

#make sure latest packages are installed
$dir/updatePackage.sh ./pub && \

#buildAndTest
$dir/buildAndTest.sh