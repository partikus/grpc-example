# Docker 

```bash
# BUILDING
docker build -t grpc/core docker/core/ 
docker build -t grpc/core-php docker/php 
docker build -t grpc/core-python docker/python 
docker build -t grpc/core-node docker/node

# COMPILING
docker run -it --rm -w /app/ -v $PWD:/app grpc/core-php bash php/build.sh 
docker run -it --rm -w /app/ -v $PWD:/app grpc/core-python bash python/build.sh 
docker run -it --rm -w /app/ -v $PWD:/app grpc/core-node bash nodejs/build.sh 

```