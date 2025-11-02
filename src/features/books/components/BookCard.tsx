import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Book } from '../types';

interface Props {
  book: Book;
  onPress: () => void;
}

export const BookCard: React.FC<Props> = React.memo(({ book, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.card}
    testID={`bookcard-${book.id}`}
  >
    <FastImage
      source={{
        uri: book?.coverImage as string,
      }}
      style={styles.image}
    />
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.author}>{book.author}</Text>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 96,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  info: { flex: 1 },
  title: { fontWeight: '700', fontSize: 16, marginBottom: 4, color: '#111' },
  author: { color: '#555' },
});
