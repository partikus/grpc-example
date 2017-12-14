import messages from '../grpc/twitter_pb';

/**
 * Method create a tweet object based on stream/api raw data
 * @param {Object} tweet
 * @returns {messages.Tweet}
 */
function create(data) {
    const tweet = new messages.Tweet();
    const author = new messages.Author();
    if (data.user.id) {
        author.setId(data.user.id);
        author.setName(data.user.name);
        author.setScreenname(data.user.screen_name);
        author.setAvatar(data.user.profile_image_url);
    }
    tweet.setRetweetcount(data.retweet_count);
    tweet.setFavoritecount(data.favorite_count);
    tweet.setAuthor(author);
    tweet.setText(data.text);
    tweet.setId(data.id_str);

    return tweet;
}

export default {
    create
}
