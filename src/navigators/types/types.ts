import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// # 스택 화면 이름
export const STACK_SCREEN_NAME = {
  First: 'First',
  Camera: 'Camera',
  Qr: 'Qr',
  Album: 'Album',
};
// # 메인 Stack Param List
export type StackParamList = {
  First: undefined;
  Camera: undefined;
  Qr: undefined;
  Album: undefined;
};
// * Navigation 타입지정 --------------------------------------------------------
// # 스택 네비게이션 타입
export type StackNavigationProps = NativeStackNavigationProp<StackParamList>;
