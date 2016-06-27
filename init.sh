#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")"

set -v
mkdir -p local/web
cp -n .default.conf.js local/conf.js
npm install
gulp
