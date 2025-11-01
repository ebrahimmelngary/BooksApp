import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookListScreen from '../features/books/screens/BookListScreen';
import BookDetailsScreen from '../features/books/screens/BookDetailsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Library" component={BookListScreen} />
      <Stack.Screen name="Details" component={BookDetailsScreen} />
    </Stack.Navigator>
  );
};
