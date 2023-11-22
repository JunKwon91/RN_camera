import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackParamList } from './types/types';
import FirstScreen from '../screens/First.screen';
import CameraScreen from '../screens/Camera.screen';
import AlbumScreen from '../screens/Album.screen';
import QrScreen from '../screens/Qr.screen';
import VideoScreen from '../screens/Video.screen';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator<StackParamList>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={'First'}
        component={FirstScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={'Camera'}
        component={CameraScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={'Qr'}
        component={QrScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={'Video'}
        component={VideoScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={'Album'}
        component={AlbumScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
