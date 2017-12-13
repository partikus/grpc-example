'use strict';

import Twitter from "twitter";
import Assert from "assert-js";
import Factory from "./tweet.factory";
import log4js from "log4js";
const logger = log4js.getLogger();
logger.level = 'debug';

export default class {
    /**
     * @param {Twitter} client
     */
    constructor(client) {
        Assert.instanceOf(client, Twitter);
        this.client = client;
        this.streams = new Map;
    }

    /**
     * @returns {Map.<string, Streamparser>}
     */
    getStreams() {
        return this.streams;
    }

    /**
     * @param {Query} query
     * @private
     */
    _closeTwitterStream(query) {
        const key = this._getKeyForQuery(query);
        if (this.streams.has(key)) {
            this.streams.get(key).emit('end');
        }
        logger.debug("Closing Twitter live streaming", key);
    }

    _getKeyForQuery(query) {
        const key = query.getTracksList().join('-') + query.getFollowsList().join('-');
        logger.debug("Genereting key of query", key);
        return key;
    }

    // * @returns {ServerWriteableStream}
    /**
     * @param {Query} query
     * @param {Object} params
     * @returns {Promise}
     * @private
     */
    _findOrCreateStream(query, params) {
        logger.debug("Looking for stream", query, params);
        const _onCreateStream = (resolve, reject) => {
            const key = this._getKeyForQuery(query);
            if (this.streams.has(key)) {
                logger.debug("Stream already exist", key);
                resolve(this.streams.get(key));
            }

            const stream = this.client.stream('statuses/filter', params);
            this.streams.set(key, stream);
            logger.debug("Stream has been created", key);

            resolve(stream);
        };

        return new Promise(_onCreateStream)
    }

    /**
     * @param {Query} query
     * @returns {Promise}
     * @private
     */
    _prepareQueryParams(query) {
        logger.debug("Building query params");
        const _promiseCallback = (resolve, reject) => {
            const params = {};
            const tracks = query.getTracksList().join(',');
            const follows = query.getFollowsList().join(',');
            if (tracks.length) {
                params['track'] = tracks;
            }

            if (follows.length === 0) {
                logger.debug("Query params were built", params);
                resolve(params);
            }

            this.client.get('users/lookup', {
                screen_name: query.getFollowsList().join(',')
            }).then(function (users) {
                const userIds = users.map(user => {
                    return user.id
                });
                params['follow'] = userIds.join(',');
                logger.debug("Query params were built", params);
                resolve(params);
            });
        };

        return new Promise(_promiseCallback);
    }

    _onTweeterStreamData(call, data) {
        logger.debug("Live streaming - Tweet received", data);
        try {
            const tweet = Factory.create(data);
            call.write(tweet);
        } catch (error) {
            logger.error(error);
        }
    };

    _onTweeterStreamEnd(call) {
        /** @type {EventEmitter} stream */
        logger.debug("Live streaming end");
        const key = this._getKeyForQuery(call.request);
        const stream = this.streams.get(key);
        this.streams.delete(key);
        if (stream.listenerCount('data') !== 0) {
            stream.removeAllListeners();
        }
    };

    _onClientCancelled(call) {
        logger.debug("Client cancelled a request.");
        this._closeTwitterStream(call.request);
        call.end();
    };

    _onClientStreamEnd(call) {
        logger.debug("Client stream finished.");
        this._closeTwitterStream(call.request);
        call.end();
    };

    /**
     * @param {EventEmitter} call
     * @param {EventEmitter} stream
     * @private
     */
    _listen(call, stream) {
        logger.debug("Configuring listeners");
        const query = call.request;
        const _onTweeterStreamError = (error, query) => {
            this._closeTwitterStream(query);
            call.end();
            throw error;
        };

        stream.on('data', (data) => this._onTweeterStreamData(call, data));
        stream.on('error', (error) => _onTweeterStreamError(error, query));
        stream.on('end', () => this._onTweeterStreamEnd(call));
        call.on('end', () => this._onClientStreamEnd(call));
        call.on('cancelled', () => this._onClientCancelled(call));
    }

    /**
     * @param call
     */
    getTweets(call) {
        /** @param {Query} query */
        const query = call.request;

        this
            ._prepareQueryParams(query)
            .then(params => this._findOrCreateStream(query, params))
            .catch(error => {
                logger.error(error);
                call.end();
            })
            .then(stream => this._listen(call, stream))
            .catch(error => {
                logger.error(error);
                call.end();
            })
    }
}
