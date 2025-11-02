import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import App from '../App';

// Mock Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => <>{children}</>,
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

// Mock RootNavigator
jest.mock('../src/navigation/RootNavigator', () => ({
  RootNavigator: () => <View testID="root-navigator" />,
}));

// Mock BooksProvider
jest.mock('../src/state/BooksContext', () => ({
  BooksProvider: ({ children }: any) => (
    <View testID="books-provider">{children}</View>
  ),
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders BooksProvider and RootNavigator hierarchy', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('books-provider')).toBeTruthy();
    expect(getByTestId('root-navigator')).toBeTruthy();
  });
});
