#!/usr/bin/env bash

# -s: return 0 if executable exists, 1 otherwise
if ! which -s sam; then
  echo "sam not found. Try . virtualenv/bin/activate"
  exit 1
fi

stack_name='HelloWorld'

cd sam-app

# bash -x deploy.sh: prints each command before executing it

# -x: print each command before executing it until `set +x` is called
set -x

# exit when any command fails
set -e

sam build

sam deploy \
  --stack-name $stack_name \
  --capabilities CAPABILITY_IAM
