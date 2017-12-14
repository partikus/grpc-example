#!/bin/bash
set -ex

language=${1:-"php"}

echo $language;

docker build -t grpc/php-plugin php
docker run -it --rm -w /app/ -v $PWD:/app grpc/node bash nodejs/build.sh
docker run -it --rm -w /app/ -v $PWD:/app grpc/core-php bash php/build.sh
docker run -it --rm -w /app/ -v $PWD:/app grpc/core-python bash python/build.sh

if [ $language == "php" ]; then
    php_output="php/grpc"
    rm -rf "$php_output" && mkdir -p "$php_output"
    protoc \
        --php_out="$php_output" \
        --grpc_out="$php_output" \
        --plugin=protoc-gen-grpc=/usr/local/bin/grpc_php_plugin \
        twitter.proto
fi

if [ $language == "nodejs" ]; then
    nodejs_output="nodejs/grpc"
    rm -rf "$nodejs_output" && mkdir -p "$nodejs_output"

#    protoc \
#        --js_out="$nodejs_output" \
#        --grpc_out="$nodejs_output" \
#        --plugin=protoc-gen-grpc=/home/grpc/bins/opt/grpc_node_plugin \
#        twitter.proto

    grpc_tools_node_protoc \
        --js_out=import_style=commonjs,binary:"$nodejs_output" \
        --grpc_out="$nodejs_output" \
        --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
        twitter.proto
fi

if [ $language == "python" ]; then
    python_output="python/server/grpc"
    rm -rf "$python_output" && mkdir -p "$python_output"

    protoc \
        --python_out="$python_output" \
        --grpc_out="$python_output" \
        --plugin=protoc-gen-grpc=/home/grpc/bins/opt/grpc_python_plugin \
        twitter.proto
fi