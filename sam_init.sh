#!/usr/bin/env bash

# It needs an app name as an argument
if [ $# -lt 1 ]; then
  echo >&2 "
Usage: ./sam_init <app-name>

e.g. ./sam_init hello-world 
"
  exit 1
fi

APP_NAME=$1

# Create a new SAM app
sam init --runtime nodejs18.x --name $APP_NAME --no-interactive --dependency-manager npm --app-template hello-world

cd $APP_NAME

find ./ -type f -exec sed -i '' -e 's/lambdaHandler/handler/g' {} \;

mv hello-world src

sed -i '' -e 's/hello-world/src/' template.yaml
sed -i '' -E -e '/^(# |  #).*/d' template.yaml
sed -i '' -E -e 's/# .*//g' template.yaml
sed -i '' -E -e 's/Timeout:.*/Timeout: 60/g' template.yaml

sed -i '' -E -e '/^(\/\*| \*).*/d' src/app.mjs
sed -i '' -E -e '/^$/d' src/app.mjs

# Empty README.md
echo '' >README.md

# Create a layout
mkdir layout
cd layout
npm init -y
sed -i '' -e 's/"license": "ISC"/"license": "ISC",\n  "type": "module"/g' package.json

# Insert "type": "module" to package.json
cd ../src
sed -i '' -e 's/"license": "MIT"/"license": "MIT",\n  "type": "module"/g' package.json
npm i
