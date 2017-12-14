<?php

namespace App;

use Grpc\ServerStreamingCall;
use Kruczek\RgDev\Twitter\Query;
use Kruczek\RgDev\Twitter\Tweet;
use Kruczek\RgDev\Twitter\TwitterBoardClient;
use Grpc\ChannelCredentials;

class Client
{
    private $client;

    public function __construct(string $hostname)
    {
        $this->client = new TwitterBoardClient($hostname, ['credentials' => ChannelCredentials::createInsecure()]);
    }

    /**
     * @param Query $query
     * @return \Generator|Tweet[]
     */
    public function getTweets(Query $query): \Generator
    {
        /** @var ServerStreamingCall $response */
        $response = $this->client->GetTweets($query);
        foreach ($response->responses() as $response) {
            yield $response;
        }
    }
}
