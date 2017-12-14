#!/usr/bin/env bash

docker build -t grpc/core docker/core/
docker build -t grpc/core-php docker/php/
docker build -t grpc/core-python docker/python/