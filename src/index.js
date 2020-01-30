import 'dotenv/config';
import mongoose from 'mongoose';

import app from './app';

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// Helper to check if a string is a valid mongodb object id
mongoose.isValidObjectId = (str) => {
    if (typeof str !== 'string') {
        return false;
    }
    return str.match(/^[a-f\d]{24}$/i);
};

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});
