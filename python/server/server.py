# -*- coding: utf-8 -*-

from tweepy.streaming import StreamListener
from tweepy import API, SearchResults

import grpc.twitter_pb2 as twitter_pb2
import grpc.twitter_pb2_grpc as twitter_pb2_grpc
import struct
import json

# from tweepy import OAuthHandler
# from tweepy import Stream

# This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):
    def on_data(self, data):
        print data
        return True

    def on_error(self, status):
        print status
        return False

class TweetsRegistry():
    def __init__(self):
        self.tweets = {}
    def add(self, tweet):
        assert isinstance(tweet, twitter_pb2.Tweet)
        self.tweets[tweet.id] = tweet

    def save(self):
        self.f = open('registry.pb', "wb")
        for tweet in self.tweets.values():
            s = tweet.SerializeToString()
            packed_len = struct.pack('>L', len(s))
            self.f.write(packed_len + s)
        self.f.close()

        self.f = open('registry.json', "wb")
        output = {}
        for tweet in self.tweets.values():
            output[tweet.id] = {
                "id": tweet.id,
                "text": tweet.text,
                "author": {
                    "id": tweet.author.id,
                    "name": tweet.author.name,
                    "screenName": tweet.author.screenName,
                    "avatar": tweet.author.avatar
                },
                "retweetCount": tweet.retweetCount,
                "favoriteCount": tweet.favoriteCount
            }
        self.f.write(json.dumps(output))
        self.f.close()

class TwitterBoard(twitter_pb2_grpc.TwitterBoardServicer):
    def __init__(self, handler):
        """
        :param handler: OAuthHandler
        """
        self.handler = handler
        self.tweets = {}
        self.registry = TweetsRegistry()

    def GetTweets(self, request, context):
        """
        :param request: twitter_pb2.Query
        :param context:
        :return:
        """
        # l = StdOutListener(self)
        # stream = Stream(self.handler, l)
        # stream.filter(track=request.q.split(' '))
        api = API(self.handler)

        statuses = api.search(q=request.q)
        for status in statuses:
            """
            :type status: tweepy.SearchResult
            """
            tweetId = str(status.id)
            author = twitter_pb2.Author(
                name=status.user.name,
                screenName=status.user.screen_name,
                id=str(status.user.id),
                avatar=status.user.profile_image_url
            )
            tweet = twitter_pb2.Tweet(
                id=str(status.id),
                author=author,
                text=status.text,
                retweetCount=status.retweet_count,
                favoriteCount=status.favorite_count
            )
            self.tweets[tweetId] = tweet
            self.registry.add(tweet)
            self.registry.save()
            yield tweet
