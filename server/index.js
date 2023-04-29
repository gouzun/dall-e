import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
    res.status(200).json({
        message: 'Hello from DALL.E server!',
    });
});

const startServer = async () => {
    try {
        const port = 8080;
        connectDB(process.env.MONGODB_URL);
        app.listen(port, () => console.log('Server started on port ',port));
        
    } catch (error) {
        console.log(error);
    }
};

startServer();