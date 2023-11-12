#!/bin/zsh

setopt flowcontrol

for VARIABLE in {1..50}; do
  echo $VARIABLE
  sleep 1

done
