# GRPC

## Python

```bash
virtualenv venv
source venv/bin/activate.fish
python -m pip install --upgrade pip
python setup.py install
python -m pip install grpcio-tools
python -m pip install python-twitter
python -m grpc_tools.protoc --python_out=python --grpc_python_out=python ../twitter.proto
rm -rf grpc && mkdir grpc
python -m grpc_tools.protoc -I../ --python_out=grpc --grpc_python_out=grpc ../twitter.proto

```