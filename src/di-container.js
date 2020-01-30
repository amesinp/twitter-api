import { createContainer, asClass, asValue } from 'awilix';

import userRepository from './data/userRepository';
import tweetRepository from './data/tweetRepository';
import followMapRepository from './data/followMapRepository';

import dummyUserRepository from './data/dummy/dummyUserRepository';
import dummyTweetRepository from './data/dummy/dummyTweetRepository';
import dummyFollowMapRepository from './data/dummy/dummyFollowMapRepository';

const container = createContainer();
if (process.env.NODE_ENV === 'test') { // When unit testing, inject dummy repositories
    container.register({
        tokenSecret: asValue('API-TEST'),
        userRepository: asClass(dummyUserRepository).singleton(),
        tweetRepository: asClass(dummyTweetRepository).singleton(),
        followMapRepository: asClass(dummyFollowMapRepository).singleton()
    });
} else {
    const tokenSecret = process.env.SECRET_KEY || 'API-0123456789';
    container.register({
        tokenSecret: asValue(tokenSecret),
        userRepository: asClass(userRepository).scoped(),
        tweetRepository: asClass(tweetRepository).scoped(),
        followMapRepository: asClass(followMapRepository).scoped()
    });
}

export default container;
