FROM grpc/core

RUN add-apt-repository ppa:ondrej/php && \
    apt-get update && \
    apt-get install --yes git && \
    apt-get install --yes php7.1 php7.1-dev php-pear zlib1g-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

RUN pecl install grpc && \
    pecl install protobuf

RUN cd /root/grpc \
    && make grpc_php_plugin \
    && cp /root/grpc/bins/opt/grpc_php_plugin /usr/local/bin/ \
    && cd /usr/local/bin/ \
    && ln -s grpc_php_plugin protoc-gen-grpc \
    && rm -rf /root/grpc

