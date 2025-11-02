export type Status = 'unread' | 'reading' | 'done';

export interface Book {
  id: string;
  title: string;
  author: string;
  lastUpdated?: string;
  status: Status;
  notes: string;
  version: number;
  coverImage: string | null | undefined;
}
