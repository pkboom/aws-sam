#!/usr/bin/env bash

if [ $# -lt 1 ]; then
  echo >&2 "
Usage: ./sam_init <app-name>

e.g. ./sam_init dmarc
"
  exit 1
fi

APP_NAME=$1

sam init --runtime nodejs18.x --name $APP_NAME --no-interactive --dependency-manager npm --app-template hello-world

cd $APP_NAME

find ./ -type f -exec sed -i '' -e 's/lambdaHandler/handler/g' {} \;

echo '' >README.md
