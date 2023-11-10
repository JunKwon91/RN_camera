/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  Camera,
  CameraDevice,
  Code,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { styled } from 'styled-components/native';

const ChangeBtn = styled.TouchableOpacity`
  position: absolute;
  left: 30px;
  width: 50px;
  height: 50px;
  border-radius: 40px;
  background-color: blue;
  align-self: center;
  bottom: 35px;
`;

const QrScreen = () => {
  // Status
  const [cameraPosition, setCameraPosition] = useState<CameraDevice>();
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false); // 카메라 전환여부
  const [message, setMessage] = useState<string>('');

  // Hook
  const cameraRef = useRef<Camera>(null);
  const back = useCameraDevice('back'); // 후면 카메라
  const front = useCameraDevice('front'); // 전면 카메라

  // 전면/후면 카메라 전환 토글
  const onToggleCameraType = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  // QRCode 스캐닝
  const onCodeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      if (message.length === 0) {
        console.log(codes);
        let _message: string = '';
        if (codes[0].value) {
          _message = codes[0].value?.toString();
        }
        setMessage(_message);
      }
    },
  });

  useEffect(() => {
    if (front && back) {
      let _camera: CameraDevice = front;
      if (!isFrontCamera) {
        _camera = back;
      }
      setCameraPosition(_camera);
    }
  }, [back, front, isFrontCamera]);

  useEffect(() => {
    if (message?.length > 0) {
      Alert.alert(
        'QR Scaning', // 첫번째 text: 타이틀 제목
        message, // 두번째 text: 그 밑에 작은 제목
        [
          // 버튼 배열
          { text: 'OK', onPress: () => setMessage('') }, //버튼 제목
          // 이벤트 발생시 로그를 찍는다
        ],
        { cancelable: false }
      );
    }
  }, [message]);

  return (
    cameraPosition && (
      <>
        <Camera
          ref={cameraRef}
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
          device={cameraPosition}
          isActive={true}
          photo={true}
          codeScanner={onCodeScanner}
        />
        <ChangeBtn onPress={onToggleCameraType} />
      </>
    )
  );
};

export default QrScreen;
