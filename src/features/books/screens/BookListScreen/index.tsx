import React, { useMemo, useState } from 'react';
import { View, FlatList, RefreshControl, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Book } from '../../types';
import { BookCard } from '../../components/BookCard';
import { loadSeedBooks } from '../../api/localApi';
import { useBooksContext } from '../../../../state/BooksContext';
import styles from './styles';

type SortBy = 'title' | 'lastUpdated';

enum Options {
  title = 'title',
  lastUpdated = 'lastUpdated',
}

export default function BookListScreen() {
  const { state, dispatch } = useBooksContext();
  const navigation = useNavigation();
  const [query, setQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>(Options.title);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const booksData: Book[] = state.books;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = booksData.slice();
    if (q) {
      arr = arr.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }
    if (sortBy === Options.title) {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      arr.sort((a, b) =>
        (b.lastUpdated || '').localeCompare(a.lastUpdated || ''),
      );
    }
    return arr;
  }, [booksData, query, sortBy]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await loadSeedBooks();
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (e) {
      dispatch({ type: 'LOAD_FAILURE', payload: (e as Error).message });
    } finally {
      setRefreshing(false);
    }
  };

  const renderCards = ({ item }: { item: Book }) => (
    <BookCard
      book={item}
      onPress={() =>
        navigation.navigate('Details' as never, { id: item.id } as never)
      }
    />
  );

  const keyExtractor = (item: Book) => item.id;

  if (state.loading)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  if (state.error)
    return (
      <View style={styles.center}>
        <Text>Error: {state.error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Library</Text>
      <View style={styles.controls}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search title or author"
          style={styles.search}
        />
        <View style={styles.sortRow}>
          <Text
            onPress={() => setSortBy(Options.title)}
            style={[
              styles.sortBtn,
              sortBy === Options.title && styles.sortActive,
            ]}
          >
            Title
          </Text>
          <Text
            onPress={() => setSortBy(Options.lastUpdated)}
            style={[
              styles.sortBtn,
              sortBy === Options.lastUpdated && styles.sortActive,
            ]}
          >
            Last Updated
          </Text>
        </View>
      </View>
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text>No books found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderCards}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
