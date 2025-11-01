import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { BooksProvider } from './src/state/BooksContext';

export default function App() {
  return (
    <BooksProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </BooksProvider>
  );
}
