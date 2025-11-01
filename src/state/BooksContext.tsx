import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Book } from '../features/books/types';
import seedBooks from '../data/books.json';
import { syncSaveQueue } from '../sync/sync';

type State = {
  books: Book[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Book[] }
  | { type: 'LOAD_FAILURE'; payload: string }
  | { type: 'UPDATE_BOOK_OPTIMISTIC'; payload: Book }
  | { type: 'APPLY_REMOTE_UPDATE'; payload: Book };

const initialState: State = {
  books: [],
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, books: action.payload };
    case 'LOAD_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_BOOK_OPTIMISTIC':
      return {
        ...state,
        books: state.books.map(b => (b.id === action.payload.id ? action.payload : b)),
      };
    case 'APPLY_REMOTE_UPDATE':
      return {
        ...state,
        books: state.books.map(b => (b.id === action.payload.id ? action.payload : b)),
      };
    default:
      return state;
  }
}

const BooksContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_START' });
    try {
      const data: Book[] = JSON.parse(JSON.stringify(seedBooks));
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
      syncSaveQueue.initializeWith(data);
    } catch (e: any) {
      dispatch({ type: 'LOAD_FAILURE', payload: e.message });
    }
  }, []);

  return <BooksContext.Provider value={{ state, dispatch }}>{children}</BooksContext.Provider>;
};

export const useBooksContext = () => useContext(BooksContext);
