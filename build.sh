#!/bin/bash
set -ex

php_output="php/grpc"
rm -rf "$php_output" && mkdir -p "$php_output"
protoc \
    --php_out="$php_output" \
    --grpc_out="$php_output" \
    --plugin=protoc-gen-grpc=/home/grpc/bins/opt/grpc_php_plugin \
    twitter.proto


nodejs_output="nodejs/grpc"
rm -rf "$nodejs_output" && mkdir -p "$nodejs_output"

protoc \
    --js_out="$nodejs_output" \
    --grpc_out="$nodejs_output" \
    --plugin=protoc-gen-grpc=/home/grpc/bins/opt/grpc_node_plugin \
    twitter.proto

grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:"$nodejs_output" \
    --grpc_out="$nodejs_output" \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    twitter.proto

python_output="python/server/grpc"
rm -rf "$python_output" && mkdir -p "$python_output"
protoc \
    --python_out="$python_output" \
    --grpc_out="$python_output" \
    --plugin=protoc-gen-grpc=/home/grpc/bins/opt/grpc_python_plugin \
    twitter.proto
