import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, Text, TextInput, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../../../../navigation/types';
import { useBooksContext } from '../../../../state/BooksContext';
import { Book } from '../../types';
import { saveBookRemote } from '../../../../sync/sync';
import { Snackbar } from '../../../../components/Snackbar';
import styles from './styles';
import { AppColors } from '../../../../constant/AppColors';

type BookDetailsRouteProp = RouteProp<RootStackParamList, 'Details'>;

enum Options {
  unread = 'unread',
  reading = 'reading',
  done = 'done',
  Undo = 'Undo',
}
export default function BookDetailsScreen() {
  const route = useRoute<BookDetailsRouteProp>();
  const { id } = route.params;
  const { state, dispatch } = useBooksContext();
  const book = state.books.find(b => b.id === id) as Book | undefined;
  const [local, setLocal] = useState<{
    status: Book['status'];
    notes: string;
    version: number;
  } | null>(null);
  const [snack, setSnack] = useState<{
    message: string;
    action?: () => void;
  } | null>(null);
  const pendingRef = useRef<{ prev?: Book } | null>(null);

  useEffect(() => {
    if (book)
      setLocal({
        status: book.status,
        notes: book.notes,
        version: book.version,
      });
  }, [book]);

  const saveOptimistic = useCallback(async () => {
    if (!book || !local) return;
    pendingRef.current = { prev: { ...book } };
    const updated: Book = {
      ...book,
      status: local.status,
      notes: local.notes,
      lastUpdated: new Date().toISOString(),
      version: book.version,
    };
    dispatch({ type: 'UPDATE_BOOK_OPTIMISTIC', payload: updated });
    setSnack({
      message: 'Saved (optimistic)',
      action: async () => {
        if (pendingRef.current?.prev) {
          dispatch({
            type: 'UPDATE_BOOK_OPTIMISTIC',
            payload: pendingRef.current.prev,
          });
          pendingRef.current = null;
          setSnack(null);
        }
      },
    });
    try {
      const res = await saveBookRemote(updated, updated.version);
      if ((res as any).conflict) {
        setSnack({
          message: 'Conflict detected. Please choose resolution in UI.',
          action: undefined,
        });
      } else if ((res as any).success) {
        dispatch({ type: 'APPLY_REMOTE_UPDATE', payload: (res as any).book });
        pendingRef.current = null;
      } else {
        setSnack({
          message: 'Save failed',
          action: () => {
            if (pendingRef.current?.prev) {
              dispatch({
                type: 'UPDATE_BOOK_OPTIMISTIC',
                payload: pendingRef.current.prev!,
              });
              pendingRef.current = null;
            }
            setSnack(null);
          },
        });
      }
    } catch (e) {
      setSnack({
        message: 'Save failed (exception)',
        action: () => {
          if (pendingRef.current?.prev) {
            dispatch({
              type: 'UPDATE_BOOK_OPTIMISTIC',
              payload: pendingRef.current.prev!,
            });
            pendingRef.current = null;
          }
          setSnack(null);
        },
      });
    }
  }, [book, local, dispatch]);

  if (!book || !local)
    return (
      <SafeAreaView style={styles.center}>
        <Text>Book not found</Text>
      </SafeAreaView>
    );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>By {book.author}</Text>
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: '700' }}>Status</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Button
              title="Unread"
              onPress={() =>
                setLocal(s => (s ? { ...s, status: Options.unread } : s))
              }
              color={
                local.status === Options.unread ? AppColors.primary : undefined
              }
            />
            <View style={{ width: 8 }} />
            <Button
              title="Reading"
              onPress={() =>
                setLocal(s => (s ? { ...s, status: Options.reading } : s))
              }
              color={
                local.status === Options.reading ? AppColors.primary : undefined
              }
            />
            <View style={{ width: 8 }} />
            <Button
              title="Done"
              onPress={() =>
                setLocal(s => (s ? { ...s, status: Options.done } : s))
              }
              color={
                local.status === Options.done ? AppColors.primary : undefined
              }
            />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: '700' }}>Notes</Text>
          <TextInput
            value={local.notes}
            onChangeText={t => setLocal(s => (s ? { ...s, notes: t } : s))}
            multiline
            style={styles.input}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <Button title="Save" onPress={saveOptimistic} />
        </View>
      </ScrollView>
      {snack && (
        <Snackbar
          message={snack.message}
          actionLabel={snack.action ? Options.Undo : undefined}
          onAction={snack.action}
        />
      )}
    </View>
  );
}
