class DummyTweetRepository {
    constructor () {
        this.tweets = [
            {
                _id: 1,
                body: 'Hello world',
                user: 1
            },
            {
                _id: 2,
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
                user: 2
            },
            {
                _id: 3,
                body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis',
                user: 1
            },
            {
                _id: 4,
                body: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
                user: 2
            }
        ];
        this.users = [
            {
                _id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                username: 'johndoe'
            },
            {
                _id: 2,
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                username: 'janedoe'
            },
            {
                _id: 3,
                name: 'John Smith',
                email: 'johnsmith@example.com',
                username: 'johnsmith'
            },
            {
                _id: 4,
                name: 'Jane Smith',
                email: 'janesmith@example.com',
                username: 'janesmith'
            }
        ];
        this.tweetReplies = [];
    }

    async createTweet (tweet) {
        let id = 1;
        if (this.tweets.length > 0) {
            id = parseInt(this.tweets[this.tweets.length - 1]._id) + 1;
        }

        tweet._id = id;
        this.tweets.push(tweet);

        // populate
        tweet.user = this.users.find(u => u._id === tweet.user);
        return tweet;
    }

    async getById (id) {
        const convertedId = parseInt(id);
        if (isNaN(convertedId)) {
            return null;
        }

        return this.tweets.find(t => t._id === convertedId);
    }

    async replyToTweet (reply) {
        let id = 1;
        if (this.tweetReplies.length > 0) {
            id = parseInt(this.tweetReplies[this.tweetReplies.length - 1]._id) + 1;
        }

        reply._id = id;
        this.tweetReplies.push(reply);

        // populate
        reply.tweet = await this.getById(reply.tweet);
        reply.tweet.user = this.users.find(u => u._id === reply.tweet.user);
        reply.user = this.users.find(u => u._id === reply.user);
        return reply;
    }

    async getTweetsForUsersPaginated (userIdList, pageSize, currentPage) {
        const tweets = JSON.parse(JSON.stringify(this.tweets)); // So that changes don't affect original array
        const filteredTweets = tweets.filter(t => userIdList.includes(t.user));
        const paginatedTweets = [];

        if (filteredTweets.length > 0) {
            filteredTweets.sort((a, b) => parseInt(b._id) - parseInt(a._id));
            
            const offset = (pageSize * currentPage) - pageSize;
            if (offset < filteredTweets.length) {
                let lastIndex = offset + pageSize;
                lastIndex = lastIndex > filteredTweets.length ? filteredTweets.length : lastIndex;
                
                for (let i = offset; i < lastIndex; i++) {
                    const tweet = filteredTweets[i];
                    tweet.user = this.users.find(u => u._id === tweet.user);
                    paginatedTweets.push(tweet);
                }
            }
        }

        return {
            count: filteredTweets.length,
            data: paginatedTweets
        };
    }
}

export default DummyTweetRepository;
