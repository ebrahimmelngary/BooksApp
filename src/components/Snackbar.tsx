import React from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';

interface Props {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const Snackbar: React.FC<Props> = ({
  message,
  actionLabel,
  onAction,
}) => {
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 4000);
    return () => clearTimeout(t);
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [80, 0],
              }),
            },
          ],
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.content}>
        <Text style={styles.text}>{message}</Text>
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction}>
            <Text style={styles.action}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 12, right: 12, bottom: 12 },
  content: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: { color: '#fff', flex: 1, marginRight: 12 },
  action: { color: '#4f46e5', fontWeight: '700' },
});
