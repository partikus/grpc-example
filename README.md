# gRPC

The repository presents a simple Tweeter streaming app that is based on [gRPC](https://grpc.io/). 

## Getting Started

The app has been written in 3 popular languages: [php](https://secure.php.net/), [python](https://www.python.org/) and [node](https://nodejs.org/en/).

### Docker 

The latest changes bring docker configuration. Instead of using vagrant you can use Docker that is recommended solution.
More details can be found in [README.md](./docker/README.md) file.

### Vagrant (deprecated)

To simplify the setup you can use [Vagrant](https://www.vagrantup.com/) configuration that was prepared. 

```bash
git clone https://github.com/partikus/grpc 
cd grpc
vagrant up # if provisioning fail please run `vagrant provision`
# then if provisioning success 
vagrant ssh
cd /home/app
./build.sh ${language} # supported languages: php, python, nodejs
```
** Windows users must have installed [winnfsd](https://github.com/winnfsd/vagrant-winnfsd) vagrant plugin **


## Materials

https://developers.google.com/protocol-buffers/docs/proto3
https://eli.thegreenplace.net/2011/08/02/length-prefix-framing-for-protocol-buffers
https://codeclimate.com/blog/choose-protocol-buffers/

## Python

https://grpc.io/docs/tutorials/basic/python.html
http://docs.python-guide.org/en/latest/writing/structure/

```bash
virtualenv venv
source venv/bin/activate.fish
python -m pip install --upgrade pip
python setup.py install
python -m pip install -r requirements
```

## NodeJS 

https://grpc.io/docs/quickstart/node.html
https://grpc.io/docs/tutorials/basic/node.html
http://pm2.keymetrics.io/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

