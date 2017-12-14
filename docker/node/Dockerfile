FROM grpc/core

RUN cd /root/grpc \
    && make grpc_node_plugin \
    && cp /root/grpc/bins/opt/grpc_node_plugin /usr/local/bin/ \
    && cd /usr/local/bin/ \
    && ln -s grpc_node_plugin protoc-gen-grpc
