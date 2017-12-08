'use strict';

import Twitter from "twitter";
import Assert from "assert-js";
import Factory from "./tweet.factory";


export default class {
    constructor(client) {
        Assert.instanceOf(client, Twitter);
        this.client = client;
    }

    getTweets() {
        return (call) => {
            /** @param {Tweet} tweet */
            /** @param {Query} query */
            const query = call.request;
            this.client.get('search/tweets', {
                q: query.getQ(),
                since_id: query.getSince(),
                result_type: query.getType(),
                count: 100
            }).then(function (tweets) {
                tweets.statuses.forEach((data) => {
                    const tweet = Factory.create(data);
                    call.write(tweet);
                });
                call.end();
            });
        }
    }
};