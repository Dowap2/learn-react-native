import { NavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Contact: undefined;
  BlogList: undefined;
  BlogDetail: {
    postId: number;
  };
  BlogCreate: { editingPostId?: number } | undefined;
  FAQ: undefined;
};

export type RootStackScreenProps<RouteName extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, RouteName>;
  route: RouteProp<RootStackParamList, RouteName>;
};
