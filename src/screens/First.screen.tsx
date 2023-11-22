/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { styled } from 'styled-components/native';
import { STACK_SCREEN_NAME, StackNavigationProps } from '../navigators/types/types';
import { useCameraPermission } from 'react-native-vision-camera';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const Btn = styled.TouchableOpacity`
  width: 100px;
  height: 50px;
  background-color: palegoldenrod;
  justify-content: center;
  align-items: center;
`;
const BtnText = styled.Text`
  color: black;
  font-size: 18px;
  font-weight: bold;
`;

const FirstScreen = () => {
  //* State ------------------------------------------------------------------

  //* Hooks ------------------------------------------------------------------
  const navi = useNavigation<StackNavigationProps>();
  const { hasPermission, requestPermission } = useCameraPermission();

  //* Function ---------------------------------------------------------------
  const onGoScreen = (_screenName: keyof typeof STACK_SCREEN_NAME) => {
    navi.navigate(_screenName);
  };

  //* Lifecycle ------------------------------
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, []);

  return (
    <Container>
      {hasPermission && (
        <>
          <Btn onPress={() => onGoScreen('Camera')}>
            <BtnText>사진</BtnText>
          </Btn>

          <View style={{ marginTop: 20 }}>
            <Btn onPress={() => onGoScreen('Qr')}>
              <BtnText>Qr</BtnText>
            </Btn>
          </View>

          <View style={{ marginTop: 20 }}>
            <Btn onPress={() => onGoScreen('Video')}>
              <BtnText>동영상</BtnText>
            </Btn>
          </View>

          <View style={{ marginTop: 20 }}>
            <Btn onPress={() => onGoScreen('Album')}>
              <BtnText>앨범</BtnText>
            </Btn>
          </View>
        </>
      )}
    </Container>
  );
};

export default FirstScreen;
