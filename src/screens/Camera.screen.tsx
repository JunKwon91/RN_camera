/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraDevice, useCameraDevice } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { styled } from 'styled-components/native';

const CaptureBtn = styled.TouchableOpacity`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: white;
  align-self: center;
  bottom: 20px;
`;

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

const ThumbnailImg = styled.Image`
  position: absolute;
  bottom: 30px;
  right: 20px;
  width: 70px;
  height: 70px;
  border-radius: 5px;
`;

const CameraScreen = () => {
  // Status
  const [cameraPosition, setCameraPosition] = useState<CameraDevice>();
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false); // 카메라 전환여부
  const [imgUrl, setImgUrl] = useState<string>('');

  // Hook
  const cameraRef = useRef<Camera>(null);
  const back = useCameraDevice('back'); // 후면 카메라
  const front = useCameraDevice('front'); // 전면 카메라

  useEffect(() => {
    if (front && back) {
      let _camera: CameraDevice = front;
      if (!isFrontCamera) {
        _camera = back;
      }
      setCameraPosition(_camera);
    }
  }, [back, front, isFrontCamera]);

  const onToggleCameraType = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const onPhoto = async () => {
    const photo = await cameraRef?.current?.takePhoto({
      flash: 'auto', // 'auto' | 'off'
      enableShutterSound: false, // 셔터소리
    });

    await CameraRoll.save(`file://${photo?.path}`, {
      type: 'photo',
    });

    setImgUrl(`file://${photo?.path}`);
  };

  return (
    cameraPosition && (
      <>
        <Camera
          ref={cameraRef}
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
          device={cameraPosition}
          isActive={true}
          photo={true}
        />
        <CaptureBtn onPress={onPhoto} />
        <ChangeBtn onPress={onToggleCameraType} />
        {imgUrl?.length > 0 && <ThumbnailImg source={{ uri: imgUrl }} />}
      </>
    )
  );
};

export default CameraScreen;
