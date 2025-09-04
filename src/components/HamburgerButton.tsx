import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

type Props = {
  onPress: () => void;
};

function HamburgerButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.line} />
      <View style={styles.line} />
      <View style={styles.line} />
    </TouchableOpacity>
  );
}

export default HamburgerButton;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 24,
    height: 3,
    backgroundColor: '#1E3A8A',
    marginVertical: 2,
    borderRadius: 2,
  },
});
