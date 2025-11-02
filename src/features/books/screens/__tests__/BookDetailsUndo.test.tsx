import React from 'react';
import { render } from '@testing-library/react-native';
import { BooksProvider } from '../../../../state/BooksContext';
import BookDetailsScreen from '../BookDetailsScreen';

jest.mock('../../../sync/sync', () => {
  const actual = jest.requireActual('../../../sync/sync');
  return {
    ...actual,
    saveBookRemote: jest.fn().mockResolvedValue({
      success: true,
      book: {
        id: '/works/OL1W',
        title: 'Test',
        author: 'A',
        status: 'unread',
        notes: '',
        version: 2,
      },
    }),
  };
});

const Wrapper = ({ children }: any) => (
  <BooksProvider>{children}</BooksProvider>
);

test('renders Save button', async () => {
  const { getByText } = render(<BookDetailsScreen />, { wrapper: Wrapper });
  expect(getByText('Save')).toBeTruthy();
});
