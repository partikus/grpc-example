'use strict';

import Twitter from "twitter";
import Assert from "assert-js";
import Factory from "./tweet.factory"

export default class {
    constructor(client) {
        Assert.instanceOf(client, Twitter);
        this.client = client;
        this.streams = new Map;
    }

    getTweets() {
        return (call) => {
            /** @param {Tweet} tweet */
            /** @param {Query} query */
            const query = call.request;
            let stream;
            if (!this.streams.has(query.getQ())) {
                stream = this.client.stream('statuses/filter', {track: query.getQ()});
                this.streams.set(query.getQ(), stream);
            } else {
                stream = this.streams.get(query.getQ());
            }

            stream.on('data', function (data) {
                const tweet = Factory.create(data);
                call.write(tweet);
            });

            stream.on('error', function(error) {
                console.error(error);
                call.end();
            });

            stream.on('end', function() {
                "use strict";
                call.end();
            });
        }
    }
}