FROM grpc/core

RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 14AA40EC0831756756D7F66C4F4EA0AAE5267A6C
    echo "deb http://ppa.launchpad.net/ondrej/php/ubuntu xenial main \ndeb-src http://ppa.launchpad.net/ondrej/php/ubuntu xenial main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install --yes git php7.1 php7.1-dev php-pear zlib1g-dev && \
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

