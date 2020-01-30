import { createContainer, asClass } from 'awilix';

import userRepository from './data/userRepository';

import dummyUserRepository from './data/dummy/dummyUserRepository';

const container = createContainer();
if (process.env.NODE_ENV === 'test') { // When unit testing, inject dummy repositories
    container.register({
        userRepository: asClass(dummyUserRepository).singleton()
    });
} else {
    container.register({
        userRepository: asClass(userRepository).scoped()
    });
}

export default container;
