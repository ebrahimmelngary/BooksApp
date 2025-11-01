/**
 * Mock sync implementation
 */

import { Book } from '../features/books/types';

type SaveResult =
  | { success: true; book: Book; newVersion: number }
  | { success: false; error: string }
  | { conflict: true; serverBook: Book };

const randomDelay = () => 400 + Math.floor(Math.random() * 500);
const randomFail = () => Math.random() < 0.15;

class MockServer {
  private store: Record<string, Book> = {};

  initialize(books: Book[]) {
    books.forEach(b => {
      this.store[b.id] = { ...b };
    });
  }

  async save(book: Book, clientVersion: number): Promise<SaveResult> {
    await new Promise(r => setTimeout(r, randomDelay()));
    if (randomFail()) return { success: false, error: 'Network error' };
    const server = this.store[book.id];
    if (!server) {
      this.store[book.id] = { ...book, version: clientVersion + 1 };
      return { success: true, book: this.store[book.id], newVersion: this.store[book.id].version };
    }
    if (clientVersion < server.version) {
      return { conflict: true, serverBook: { ...server } };
    }
    const newVersion = server.version + 1;
    const merged = { ...book, version: newVersion };
    this.store[book.id] = merged;
    return { success: true, book: merged, newVersion };
  }

  getBook(id: string) {
    return this.store[id] ? { ...this.store[id] } : null;
  }
}

export const mockServer = new MockServer();

class SaveQueue {
  private queues: Record<string, Promise<any>> = {};

  initializeWith(books: Book[]) {
    mockServer.initialize(books);
  }

  enqueueSave(book: Book, clientVersion: number): Promise<SaveResult> {
    const key = book.id;
    const prev = this.queues[key] || Promise.resolve();
    const next = prev.then(async () => {
      const res = await mockServer.save(book, clientVersion);
      return res;
    });
    this.queues[key] = next.then(() => {}).catch(() => {});
    return next;
  }
}

export const syncSaveQueue = new SaveQueue();

export const saveBookRemote = (book: Book, version: number) => {
  return syncSaveQueue.enqueueSave(book, version);
};
