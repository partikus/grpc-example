FROM grpc/python

RUN apt-get update && \
    apt-get install --yes build-essential autoconf libtool zlib1g-dev zip unzip automake libtool pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN git clone -q --depth 1 --recursive -b $(curl -L https://grpc.io/release) https://github.com/grpc/grpc /root/grpc \
    && cd /root/grpc \
    && make grpc_php_plugin \
    && cp /root/grpc/bins/opt/grpc_php_plugin /usr/local/bin/ \
    && cd /usr/local/bin/ \
    && ln -s grpc_php_plugin protoc-gen-grpc
