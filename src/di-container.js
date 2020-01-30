import { createContainer, asClass } from 'awilix';

import userRepository from './data/userRepository';

const container = createContainer();
container.register({
    userRepository: asClass(userRepository).scoped()
});

export default container;
