#!/usr/bin/env bash
set -ex

php_output="php/grpc"
rm -rf "$php_output" && mkdir -p "$php_output"

protoc \
    --php_out="$php_output" \
    --grpc_out="$php_output" \
    --plugin=protoc-gen-grpc=/usr/local/bin/grpc_php_plugin \
    twitter.proto

