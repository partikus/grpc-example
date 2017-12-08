# -*- coding: utf-8 -*-

import time

import grpc
from concurrent import futures
from tweepy import OAuthHandler

import server as twitterServer
import settings
import grpc.twitter_pb2_grpc as twitter_pb2_grpc

_DAY_IN_SECONDS = 60 * 60 & 24
settings.load()

auth = OAuthHandler(settings.get("TWITTER_CONSUMER_KEY"), settings.get("TWITTER_CONSUMER_SECRET"))
auth.set_access_token(settings.get("TWITTER_ACCESS_TOKEN_KEY"), settings.get("TWITTER_ACCESS_TOKEN_SECRET"))


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    twitter_pb2_grpc.add_TwitterBoardServicer_to_server(twitterServer.TwitterBoard(auth), server)
    server.add_insecure_port('[::]:50052')
    server.start()
    try:
        while True:
            time.sleep(_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    serve()
