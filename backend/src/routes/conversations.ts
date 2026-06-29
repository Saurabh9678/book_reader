import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db/client';
import * as aiClient from '../services/aiClient';

export const conversationsRouter = Router();

conversationsRouter.post('/:bookId/conversations', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { question, currentChapter } = req.body as { question: string; currentChapter: number };
    const { bookId } = req.params;

    if (!question || typeof currentChapter !== 'number') {
      res.status(400).json({ error: 'question and currentChapter are required' });
      return;
    }

    const chatResult = await aiClient.chat(bookId, question, currentChapter);

    const chapterResult = await pool.query(
      'SELECT id FROM chapters WHERE book_id = $1 AND chapter_number = $2',
      [bookId, currentChapter]
    );
    const chapterId = chapterResult.rows[0]?.id || null;

    const convResult = await pool.query(
      'INSERT INTO conversations (book_id, chapter_id, question, response) VALUES ($1, $2, $3, $4) RETURNING id',
      [bookId, chapterId, question, chatResult.response]
    );

    res.json({ conversationId: convResult.rows[0].id, response: chatResult.response });
  } catch (err) {
    next(err);
  }
});

conversationsRouter.get('/:bookId/conversations', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, chapter_id, question, response, created_at FROM conversations WHERE book_id = $1 ORDER BY created_at ASC',
      [req.params.bookId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

conversationsRouter.post('/:bookId/explain', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { selectedText, currentChapter } = req.body as { selectedText: string; currentChapter: number };
    const { bookId } = req.params;

    if (!selectedText) {
      res.status(400).json({ error: 'selectedText is required' });
      return;
    }

    const result = await aiClient.explain(bookId, selectedText, currentChapter || 1);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
