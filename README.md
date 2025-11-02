This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).
# DEMO
![Simulator Screen Recording - iPhone 16 Plus - 2025-11-02 at 00 47 31](https://github.com/user-attachments/assets/49d81ec2-e54a-475f-a9e7-59217330eacd)


# Getting Started
# BooksApp Project Structure

## Overview
A React Native application for managing books with features for tracking reading status, syncing data, and organizing book collections.

---

## Directory Structure

### `/src`
Root source directory containing all application code.

---

### `/src/components`
Reusable UI components used across the application.

- **`__test__/`** - Unit tests for components
- **`Snackbar.tsx`** - Toast notification component for user feedback

---

### `/src/constant`
Application-wide constants and configuration values.

- **`AppColors.ts`** - Color palette and theme definitions used throughout the app

---

### `/src/data`
Static data and initial datasets.

- **`books.json`** - Initial book data, seed data, or mock data for development/testing

---

### `/src/features/books`
Main feature module for book management functionality.

#### `/src/features/books/api`
API integration layer for book-related operations.
- Handles external API calls (e.g., Open Library API)
- Manages data fetching and transformation

#### `/src/features/books/components`
Book-specific UI components.

- **`__tests__/`** - Component unit tests
- **`BookCard.tsx`** - Card component for displaying book information in lists

#### `/src/features/books/screens`
Screen-level components for book-related views.

- **`__tests__/`** - Screen integration tests
- **`BookDetailsScreen/`** - Detailed view of a single book
  - Edit book information
  - Update reading status
  - Add/edit notes
- **`BookListScreen/`** - List view of all books
  - Display books with filters
  - Search functionality
  - Navigation to details

#### `/src/features/books/types.ts`
TypeScript type definitions for book-related data structures.

```typescript
// Example types:
// - Book
// - BookStatus ('read' | 'reading' | 'unread')
// - BookFormData
```

---

### `/src/navigation`
Navigation configuration and routing.

- **`RootNavigator.tsx`** - Main navigation container and route definitions
- **`types.ts`** - TypeScript types for navigation props and route params

---

### `/src/state`
Global state management using React Context API.

- **`BooksContext.tsx`** - Context provider for books state
  - Book CRUD operations
  - State management hooks
  - Global book data access

---

### `/src/sync`
Data synchronization layer for remote storage.

- **`sync.ts`** - Synchronization logic
  - `saveBookRemote()` - Save book data to remote server
  - Conflict resolution
  - Offline/online sync management
  - Version control for data consistency

---

### `/src/vendor`
Third-party libraries, polyfills, or vendor-specific code.

---

## Key Architectural Patterns

### Feature-Based Organization
The app uses a feature-based structure under `/src/features/`, where each feature (like `books`) contains its own:
- API layer
- Components
- Screens
- Type definitions

This promotes:
- **Modularity** - Features are self-contained
- **Scalability** - Easy to add new features
- **Maintainability** - Related code is co-located

### State Management
- **Global State**: Managed via React Context (`BooksContext`)
- **Local State**: Component-level state using React hooks

### Data Flow
```
User Interface (Screens/Components)
         ↓
    BooksContext (State)
         ↓
    Sync Layer (sync.ts)
         ↓
    API Layer (features/books/api)
         ↓
    Remote Server / Local Storage
```

---

## Testing Strategy

### Unit Tests
- **Components**: `/src/components/__test__/`
- **Book Components**: `/src/features/books/components/__tests__/`

### Integration Tests
- **Screens**: `/src/features/books/screens/__tests__/`
- Test user interactions and data flow

### Test Setup
- Uses Jest with React Native Testing Library
- Mocks for external dependencies (sync, API calls)
- Wrapper components for context providers

---

## Getting Started

### Development Workflow
1. **Components**: Create reusable UI in `/src/components/`
2. **Features**: Build feature-specific logic in `/src/features/`
3. **State**: Manage data in `/src/state/BooksContext.tsx`
4. **Sync**: Handle remote operations in `/src/sync/sync.ts`
5. **Navigation**: Configure routes in `/src/navigation/`

### Adding a New Feature
1. Create folder: `/src/features/[feature-name]/`
2. Add subdirectories: `api/`, `components/`, `screens/`
3. Define types in `types.ts`
4. Create context if needed in `/src/state/`
5. Register routes in `/src/navigation/RootNavigator.tsx`

---

## Dependencies
- **React Native** - Mobile framework
- **React Navigation** - Routing and navigation
- **Jest** - Testing framework
- **React Native Testing Library** - Component testing utilities

---

## Best Practices

### File Naming
- **Components**: PascalCase (e.g., `BookCard.tsx`)
- **Utilities**: camelCase (e.g., `sync.ts`)
- **Tests**: Match component name with `.test.tsx` suffix

### Type Safety
- Define all types in `types.ts` files
- Use TypeScript for all new code
- Avoid `any` types

### Testing
- Write tests alongside components
- Mock external dependencies
- Use descriptive test names
- Aim for high coverage of critical paths

### Code Organization
- Keep components small and focused
- Extract reusable logic into hooks
- Co-locate related code
- Separate concerns (UI, logic, state, API)
