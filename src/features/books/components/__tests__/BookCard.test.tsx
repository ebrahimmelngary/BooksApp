import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FastImage from 'react-native-fast-image';
import { Book } from '../../types';
import { BookCard } from '../BookCard';

// Mock FastImage to avoid native dependency issues in Jest
jest.mock('react-native-fast-image', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    priority: { normal: 'normal' },
  };
});

describe('BookCard', () => {
  const mockBook: Book = {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverImage: 'https://example.com/gatsby.jpg',
  };

  it('renders book title and author', () => {
    const { getByText } = render(
      <BookCard book={mockBook} onPress={jest.fn()} />,
    );

    expect(getByText('The Great Gatsby')).toBeTruthy();
    expect(getByText('F. Scott Fitzgerald')).toBeTruthy();
  });

  it('renders book cover image with correct source', () => {
    const { UNSAFE_getByType } = render(
      <BookCard book={mockBook} onPress={jest.fn()} />,
    );

    const fastImage = UNSAFE_getByType(FastImage);
    expect(fastImage.props.source.uri).toBe(mockBook.coverImage);
    expect(fastImage.props.source.priority).toBe(FastImage.priority.normal);
  });

  it('calls onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <BookCard book={mockBook} onPress={onPressMock} />,
    );

    const card = getByTestId('bookcard-1');
    fireEvent.press(card);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('sets correct testID', () => {
    const { getByTestId } = render(
      <BookCard book={mockBook} onPress={jest.fn()} />,
    );

    expect(getByTestId('bookcard-1')).toBeTruthy();
  });
});
