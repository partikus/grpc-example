import messages from '../grpc/twitter_pb';

/**
 * @param {Object} tweet
 * @returns {messages.Tweet}
 *
 */
function create(data) {
    const tweet = new messages.Tweet();
    const author = new messages.Author();
    author.setId(data.user.id);
    author.setName(data.user.name);
    author.setScreenname(data.user.screen_name);
    author.setAvatar(data.user.profile_image_url);
    tweet.setText(data.text);
    tweet.setAuthor(author);
    tweet.setId(data.id_str);

    return tweet;
}

export default {
    create
}
