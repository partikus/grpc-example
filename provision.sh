#!/bin/bash

#echo -e "Install php ondrej repository"
#add-apt-repository ppa:ondrej/php
#apt-get update
#
#apt-get install --yes git htop mc
#apt-get install --yes php7.1 php7.1-dev php-pear zlib1g-dev
#
#echo -e "Install php package manager"
#curl -sS https://getcomposer.org/installer | php
#sudo mv composer.phar /usr/local/bin/composer
#
#pecl install grpc
#pecl install protobuf
#
#curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
#apt-get install -y nodejs
#
#sudo npm install --unsafe-perm -g grpc-tools google-protobuf grpc
#
#wget https://github.com/google/protobuf/releases/download/v3.5.0/protoc-3.5.0-linux-x86_64.zip
#unzip protoc-3.5.0-linux-x86_64.zip
#mv bin/* /usr/local/bin/
#mv include/* /usr/local/include/


apt-get install build-essential autoconf libtool zlib1g-dev zip unzip

if [ ! -d /home/grpc ]; then
    git clone --depth 1 -b $(curl -L https://grpc.io/release) https://github.com/grpc/grpc /home/grpc;
fi

cd /home/grpc
git pull --recurse-submodules
git submodule update --init --recursive
make grpc_php_plugin
mv bins/opt/grpc_php_plugin /usr/local/bin/

chmod 755 /usr/local/bin/*