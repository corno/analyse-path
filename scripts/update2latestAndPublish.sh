#!/usr/bin/env bash

dir=`realpath $(dirname "$0")`

$dir/validatePublicationReadiness.sh && \
$dir/update2latest.sh && \
$dir/buildAndTest.sh && \
git commit -am "u2l" && \
$dir/publish.sh $1