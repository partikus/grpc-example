# -*- coding: utf-8 -*-

import os
from os.path import join, dirname

from dotenv import load_dotenv


def load():
    dotenv_path = join(dirname(__file__), './../../.env')
    load_dotenv(dotenv_path)


def get(key):
    return os.environ.get(key)
