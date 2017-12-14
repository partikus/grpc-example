'use strict';

import grpc from "grpc";
import dotenv from "dotenv";
import twitter from "twitter";
import services from "./../grpc/twitter_grpc_pb";
import twitterService from "./../server/streamTwitter.service";

dotenv.config({'path': '../.env'});

const client = new twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const service = new twitterService(client);

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
    const server = new grpc.Server();
    server.addService(services.TwitterBoardService, service);
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
}

main();
