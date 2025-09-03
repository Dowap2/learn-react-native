import React, { useEffect, useRef } from 'react';
import {
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RootStackParamList } from 'App';

type MenuScreen = 'Home' | 'BlogList' | 'FAQ' | 'Camera' | 'Contact';

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: MenuScreen) => void;
};

function SideMenu({ visible, onClose, onNavigate }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View
          style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
        >
          <Text style={styles.menuTitle}>메뉴</Text>

          <MenuItem label="홈" onPress={() => onNavigate('Home')} />
          <MenuItem label="블로그" onPress={() => onNavigate('BlogList')} />
          <MenuItem label="FAQ" onPress={() => onNavigate('FAQ')} />
          <MenuItem label="카메라" onPress={() => onNavigate('Camera')} />
          <MenuItem label="문의하기" onPress={() => onNavigate('Contact')} />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

export default SideMenu;

type MenuItemProps = {
  label: string;
  onPress: () => void;
};

function MenuItem({ label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  sideMenu: {
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 80,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: -4, height: 0 },
    elevation: 5,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  menuItem: {
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
});
