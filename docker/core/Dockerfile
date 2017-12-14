FROM ubuntu

RUN apt-get update && \
    apt-get install --yes git curl build-essential autoconf libtool zlib1g-dev zip unzip  automake libtool pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN git clone -q --depth 1 --recursive -b $(curl -L https://grpc.io/release) https://github.com/grpc/grpc /root/grpc

RUN curl -Ls -O https://github.com/google/protobuf/releases/download/v3.5.0/protoc-3.5.0-linux-x86_64.zip && \
    unzip protoc-3.5.0-linux-x86_64.zip && \
    cp -R bin /usr/local/ && \
    cp -R include /usr/local/
