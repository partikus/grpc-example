#!/usr/bin/env bash
set -ex

python_output="python/server/grpc"
rm -rf "$python_output" && mkdir -p "$python_output"

protoc \
    --python_out="$python_output" \
    --grpc_out="$python_output" \
    --plugin=protoc-gen-grpc=/home/grpc/bins/opt/grpc_python_plugin \
    twitter.proto
