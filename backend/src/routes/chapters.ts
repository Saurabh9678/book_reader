import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db/client';

export const chaptersRouter = Router();

chaptersRouter.get('/:bookId/chapters', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, chapter_number, title, summary FROM chapters WHERE book_id = $1 ORDER BY chapter_number',
      [req.params.bookId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

chaptersRouter.get('/:bookId/chapters/:chapterNumber', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, book_id, chapter_number, title, content, summary FROM chapters WHERE book_id = $1 AND chapter_number = $2',
      [req.params.bookId, parseInt(req.params.chapterNumber)]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
