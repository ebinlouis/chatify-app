import express from 'express';
import path from 'path';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { fileURLToPath } from 'url';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import cookieParser from 'cookie-parser';

const PORT = ENV.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend', 'dist', 'index.html'));
    });
}
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server Running on port ${PORT}`);
});
