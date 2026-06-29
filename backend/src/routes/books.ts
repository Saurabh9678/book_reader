import { Router, Request, Response, NextFunction } from 'express';
import { uploadMiddleware } from '../middleware/upload';
import { processUpload } from '../services/pdfService';
import { pool } from '../db/client';

export const booksRouter = Router();

booksRouter.post(
  '/upload',
  uploadMiddleware.single('file'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const result = await processUpload(req.file, pool);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

booksRouter.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, title, total_pages, created_at FROM books ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

booksRouter.get('/:bookId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, title, total_pages, created_at FROM books WHERE id = $1',
      [req.params.bookId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
