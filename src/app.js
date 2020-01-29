import express from 'express';

const app = express();

app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Twitter API v1' });
});

export default app;
