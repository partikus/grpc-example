#!/usr/bin/env bash

nodejs_output="nodejs/grpc"
rm -rf "$nodejs_output" && mkdir -p "$nodejs_output"


protoc \
    --js_out="import_style=commonjs,binary:$nodejs_output" \
    --grpc_out="$nodejs_output" \
    --plugin=protoc-gen-grpc=/usr/local/bin/grpc_node_plugin \
    twitter.proto

#
#grpc_tools_node_protoc \
#        --js_out=import_style=commonjs,binary:"$nodejs_output" \
#        --grpc_out="$nodejs_output" \
#        --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
#        twitter.proto
