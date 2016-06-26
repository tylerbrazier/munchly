#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")"

set -v
mkdir -p local/web
cp .default.conf.js local/conf.js
npm install
gulp
