import books from '../../../data/books.json';
import { Book } from '../types';

export const loadSeedBooks = async (): Promise<Book[]> => {
  await new Promise(r => setTimeout(r, 100));
  return JSON.parse(JSON.stringify(books)) as Book[];
};
