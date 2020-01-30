import { createContainer, asClass, asValue } from 'awilix';

import userRepository from './data/userRepository';
import tweetRepository from './data/tweetRepository';

import dummyUserRepository from './data/dummy/dummyUserRepository';
import dummyTweetRepository from './data/dummy/dummyTweetRepository';

const container = createContainer();
if (process.env.NODE_ENV === 'test') { // When unit testing, inject dummy repositories
    container.register({
        tokenSecret: asValue('API-TEST'),
        userRepository: asClass(dummyUserRepository).singleton(),
        tweetRepository: asClass(dummyTweetRepository).singleton()
    });
} else {
    const tokenSecret = process.env.SECRET_KEY || 'API-0123456789';
    container.register({
        tokenSecret: asValue(tokenSecret),
        userRepository: asClass(userRepository).scoped(),
        tweetRepository: asClass(tweetRepository).scoped()
    });
}

export default container;
