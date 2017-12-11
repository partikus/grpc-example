FROM ubuntu

RUN apt-get update && \
    apt-get install --yes git curl build-essential autoconf libtool zlib1g-dev zip unzip  automake libtool pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN git clone -q --depth 1 --recursive -b $(curl -L https://grpc.io/release) https://github.com/grpc/grpc /root/grpc
