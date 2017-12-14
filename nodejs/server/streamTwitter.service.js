'use strict';

import Twitter from "twitter";
import Assert from "assert-js";
import log4js from "log4js";
import Factory from "./tweet.factory";

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
        this.isLocked = false;
        this.lockedAt = null;
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
            this.streams.get(key).destroy();
            this.streams.get(key).emit('end');
        }
        logger.debug("Closing Twitter live streaming", key);
    }

    _getKeyForQuery(query) {
        const key = query.getTracksList().join('-') + query.getFollowsList().join('-');
        logger.debug("Genereting key of query", key);
        return key;
    }

    _isLocked() {
        const lockExpired = Date.now() > this.lockedAt;
        if (this.isLocked && lockExpired) {
            logger.debug("Streaming has been unlocked");
            this.isLocked = false;
            this.lockedAt = null;
        }

        return this.isLocked;
    }

    _lock() {
        const MINUTES_IN_TIMESTAMP = 60 * 1000 * 10;
        this.isLocked = true;
        this.lockedAt = Date.now() + MINUTES_IN_TIMESTAMP;
    }

    // * @returns {ServerWriteableStream}
    /**
     * @param {Query} query
     * @param {Object} params
     * @returns {Promise}
     * @private
     */
    _findOrCreateStream(query, params) {
        logger.debug("Looking for stream");
        const _onCreateStream = (resolve, reject) => {
            if (this._isLocked()) {
                throw new Error("Streaming is temporary locked");
            }

            try {
                const key = this._getKeyForQuery(query);
                if (this.streams.has(key)) {
                    logger.debug("Stream already exist", key);
                    resolve(this.streams.get(key));
                }

                const stream = this.client.stream('statuses/filter', params);
                this.streams.set(key, stream);
                logger.debug("Stream has been created", key);
                resolve(stream);
            } catch (e) {
                throw e;
            }
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
            }).catch(error => reject(error));
        };

        return new Promise(_promiseCallback);
    }

    _onTwitterStreamData(call, data) {
        logger.debug("Live streaming - Tweet received");
        try {
            const tweet = Factory.create(data);
            call.write(tweet);
        } catch (error) {
            logger.error(error);
        }
    };

    _onTwitterStreamEnd(call) {
        /** @type {EventEmitter} stream */
        logger.debug("Live streaming end");
        const key = this._getKeyForQuery(call.request);
        if (!this.streams.has(key)) {
            return;
        }

        const stream = this.streams.get(key);
        this.streams.delete(key);
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

    _onTwitterStreamError(call, error) {
        logger.error("Twitter Streaming error: " + error.message);
        if (!!error.message.match(/420/i)) {
            this._lock();
        }
        this._closeTwitterStream(call.request);
        call.end();
    }

    /**
     * @param {EventEmitter} call
     * @param {EventEmitter} stream
     * @private
     */
    _listen(call, stream) {
        logger.debug("Configuring listeners");
        const query = call.request;

        stream.on('data', (data) => this._onTwitterStreamData(call, data));
        stream.on('error', (error) => this._onTwitterStreamError(call, error));
        stream.on('end', () => this._onTwitterStreamEnd(call));

        call.on('end', () => this._onClientStreamEnd(call));
        call.on('cancelled', () => this._onClientCancelled(call));
    }

    /**
     * @param call
     */
    getTweets(call) {
        /** @param {Query} query */
        const query = call.request;

        const _onError = (error) => {
            logger.error(error.message || "An error occured");
            call.end();
        };

        this
            ._prepareQueryParams(query)
            .then(params => this._findOrCreateStream(query, params), (error) => { throw error })
            .then(stream => this._listen(call, stream), (error) => { throw error })
            .catch(_onError)
    }
}
