import { Pool } from 'pg';
import * as aiClient from './aiClient';
import { ExtractedChapter } from '../types';

interface ProcessResult {
  bookId: string;
  title: string;
  totalPages: number;
  chaptersDetected: number;
}

export async function processUpload(
  file: Express.Multer.File,
  pool: Pool
): Promise<ProcessResult> {
  const extracted = await aiClient.extractPdf('temp', file.path);

  const bookResult = await pool.query(
    'INSERT INTO books (title, file_path, total_pages) VALUES ($1, $2, $3) RETURNING id',
    [extracted.title, file.path, extracted.total_pages]
  );
  const bookId: string = bookResult.rows[0].id;

  await bulkInsertChapters(pool, bookId, extracted.chapters);

  pool
    .query('SELECT id, chapter_number FROM chapters WHERE book_id = $1 ORDER BY chapter_number', [bookId])
    .then(async (res) => {
      const chaptersWithIds = res.rows.map((row: { id: string; chapter_number: number }) => {
        const ch = extracted.chapters.find((c) => c.chapter_number === row.chapter_number);
        return { chapter_id: row.id, content: ch?.content || '' };
      });
      await aiClient.summarizeAll(bookId, chaptersWithIds);
    })
    .catch((err) => console.error('Background summarization failed:', err));

  return {
    bookId,
    title: extracted.title,
    totalPages: extracted.total_pages,
    chaptersDetected: extracted.chapters.length,
  };
}

async function bulkInsertChapters(
  pool: Pool,
  bookId: string,
  chapters: ExtractedChapter[]
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const ch of chapters) {
      await client.query(
        'INSERT INTO chapters (book_id, chapter_number, title, content) VALUES ($1, $2, $3, $4)',
        [bookId, ch.chapter_number, ch.title, ch.content]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
