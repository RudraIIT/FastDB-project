#!/bin/sh

set -e # Exit early if any commands fail

exec nodemon app/main.js "$@"
