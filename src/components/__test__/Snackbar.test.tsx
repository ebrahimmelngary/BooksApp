import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { Snackbar } from '../Snackbar';

jest.useFakeTimers();
jest.spyOn(Animated, 'timing').mockImplementation(
  () =>
    ({
      start: (cb?: () => void) => cb && cb(),
    } as any),
);

describe('Snackbar', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('renders message correctly', () => {
    const { getByText } = render(<Snackbar message="Hello world" />);
    expect(getByText('Hello world')).toBeTruthy();
  });

  it('renders action button when actionLabel and onAction are provided', () => {
    const { getByText } = render(
      <Snackbar message="Saved" actionLabel="UNDO" onAction={jest.fn()} />,
    );
    expect(getByText('UNDO')).toBeTruthy();
  });

  it('does not render action button if actionLabel is missing', () => {
    const { queryByText } = render(
      <Snackbar message="Saved" onAction={jest.fn()} />,
    );
    expect(queryByText('UNDO')).toBeNull();
  });

  it('calls onAction when action button is pressed', () => {
    const onActionMock = jest.fn();
    const { getByText } = render(
      <Snackbar message="Deleted" actionLabel="UNDO" onAction={onActionMock} />,
    );

    fireEvent.press(getByText('UNDO'));
    expect(onActionMock).toHaveBeenCalledTimes(1);
  });

  it('starts entrance and exit animations', () => {
    render(<Snackbar message="Animating..." />);
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    );

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(Animated.timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    );
  });

  it('clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(<Snackbar message="Unmount test" />);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
