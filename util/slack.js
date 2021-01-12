const {WebClient} = require('@slack/web-api');

const settings = require('../config/config');

const token = settings.token;

const web = new WebClient(token);

module.exports = {
    sendMessage: (message) => {
        web.chat.postMessage({channel: settings.channel, text: `${message}`})
            .catch(err => {
                logger.error(err);
            });
    },
};
