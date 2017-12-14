FROM grpc/core

RUN cd /root/grpc \
    && make grpc_python_plugin \
    && cp /root/grpc/bins/opt/grpc_python_plugin /usr/local/bin/ \
    && cd /usr/local/bin/ \
    && ln -s grpc_python_plugin protoc-gen-grpc \
    && rm -rf /root/grpc
