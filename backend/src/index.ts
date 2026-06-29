import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { booksRouter } from './routes/books';
import { chaptersRouter } from './routes/chapters';
import { conversationsRouter } from './routes/conversations';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/books', booksRouter);
app.use('/api/books', chaptersRouter);
app.use('/api/books', conversationsRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
