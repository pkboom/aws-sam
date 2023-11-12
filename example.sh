#!/usr/bin/env bash

# If we don't have 2 arguments passed,
# print usage and exit with error code
if [ $# -lt 2 ]; then
  echo >&2 "
Usage: ./run <env> <command>

e.g. ./run staging
"
  exit 1
fi

# First argument is terraform environment
TF_ENV=$1

# Get the directory containing this script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# Always run from the location of this script
cd $DIR

# Remove first argument
shift

# Run terraform with any arguments passed
terraform -chdir=./$TF_ENV $@

# Head back to original location to avoid surprises
cd -
