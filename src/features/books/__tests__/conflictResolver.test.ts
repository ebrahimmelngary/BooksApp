import { mockServer, syncSaveQueue } from '../../../sync/sync';
import { Book } from '../../books/types';

test('conflict resolver returns conflict when server version higher', async () => {
  const book: Book = { id: 'conf1', title: 'A', author: 'X', status: 'unread', notes: '', version: 1 };
  mockServer.initialize([{ ...book, version: 5 }]);
  const res = await syncSaveQueue.enqueueSave({ ...book, notes: 'edited' }, 1);
  expect((res as any).conflict).toBeTruthy();
});
