import express from 'express';
import { loadControllers, scopePerRequest } from 'awilix-express';
import cors from 'cors';

import container from './di-container';

const app = express();

app.use(express.json());
app.use(cors());

// Dependency injection setup
app.use(scopePerRequest(container));
app.use(loadControllers('routes/*.js', { cwd: __dirname }));

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Twitter API v1' });
});

export default app;
