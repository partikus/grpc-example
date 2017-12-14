# -*- coding: utf-8 -*-

# Learn more: https://github.com/kennethreitz/setup.py

from setuptools import setup, find_packages

setup(
    name='grpc-twitter',
    version='0.1.0',
    description='Twitter gRPC example',
    long_description="Missing",
    author='Michal Kruczek',
    author_email='michal@kruczek.it',
    url='https://github.com/partikus/grpc-twitter',
    license="MIT",
    packages=find_packages(exclude=('tests', 'docs'))
)
