#!/bin/sh

if [ -z "$@" ];
then
    echo "Remove leftover socket file"
    rm /tmp/*.sock

    echo "Running mongo"
    mongod
else
    eval $@
fi