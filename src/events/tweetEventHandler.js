class TweetEvents {
    constructor () {
        this.streamClients = {};
    }

    registerClient (userId, responseStream) {
        this.streamClients[userId] = responseStream;
    }

    sendToClients (userIds, tweet) {
        userIds.forEach((id) => {
            if (Object.prototype.hasOwnProperty.call(this.streamClients, id)) {
                this.streamClients[id].write(`data: ${JSON.stringify(tweet)} \n\n`);
            }
        });
    }
}

export default TweetEvents;
