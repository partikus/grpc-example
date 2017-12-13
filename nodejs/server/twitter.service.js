'use strict';

import Twitter from "twitter";
import Assert from "assert-js";
import Factory from "./tweet.factory";
import log4js from "log4js";
import messages from "../grpc/twitter_pb";
const logger = log4js.getLogger();
logger.level = 'debug';

export default class {
    constructor(client) {
        Assert.instanceOf(client, Twitter);
        this.client = client;
    }

    _buildQuery(query) {
        const tracks = query.getTracksList().map(v => "#" + v).join(' OR ');
        const follows = query.getFollowsList().map(v => "@" + v).join(' OR ');

        return [tracks, follows].join(' OR ');
    }

    _getResultType(resultType) {
        switch (resultType) {
            case messages.ResultType.RECENT:
                return 'recent';
                break;
            default:
                return 'mixed';
                break;
        }

    }

    _onTwitterApiData(call, response) {
        let promises = [];
        response.statuses.forEach((data) => {
            promises.push(new Promise((resolve, reject) => {
                const tweet = Factory.create(data);
                call.write(tweet);
                resolve();
            }))
        });

        return Promise.all(promises);
    }

    getTweets(call) {
        /** @param {Tweet} tweet */
        /** @param {Query} query */
        const query = call.request;
        const params = {
            q: this._buildQuery(query),
            since_id: query.getSince(),
            result_type: this._getResultType(query.getType()),
            count: 100
        };
        logger.debug("Searching tweets ", params);
        this.client.get('search/tweets', params)
            .then((response) => this._onTwitterApiData(call, response))
            .then(() => call.end())
            .catch(error => {
                call.end();
                throw error;
            });
    }
};
