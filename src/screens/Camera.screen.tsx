/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import {
  GestureEvent,
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import { Camera, CameraDevice, useCameraDevice } from 'react-native-vision-camera';
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
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
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

  // Zoom 구현 ----------------------------------------------------------------------------------------
  // 줌 상태를 관리합니다.
  const [zoom, setZoom] = useState(0);
  // 기준 스케일 값을 추적하기 위한 ref를 생성합니다.
  const lastZoom = useRef(1);

  const onPinchGestureEvent = (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
    if (cameraPosition != null && event.nativeEvent.state === State.ACTIVE) {
      let newZoom = lastZoom.current * event.nativeEvent.scale;
      if (newZoom < cameraPosition.minZoom) newZoom = cameraPosition.minZoom; // 최소 줌 값을 디바이스의 minZoom으로 제한합니다.
      if (newZoom > cameraPosition.maxZoom) newZoom = cameraPosition.maxZoom; // 최대 줌 값을 디바이스의 maxZoom으로 제한합니다.

      setZoom(newZoom);
    }
  };

  // 핀치 제스처가 끝나면 기준 스케일 값을 업데이트합니다.
  const onPinchHandlerStateChange = (
    event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // 핀치가 끝났으므로 현재 스케일 값을 기준 스케일로 설정합니다.
      lastZoom.current = zoom;
    }
  };

  // Slider
  const onValueChange = (value: number) => {
    // 핀치가 끝났으므로 현재 스케일 값을 기준 스케일로 설정합니다.
    lastZoom.current = zoom;

    setZoom(value);
  };

  return (
    cameraPosition && (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}
        >
          <View style={{ flex: 1 }}>
            <Camera
              ref={cameraRef}
              style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
              device={cameraPosition}
              isActive={true}
              zoom={zoom}
              photo={true}
            />
            <CaptureBtn onPress={onPhoto} />
            <ChangeBtn onPress={onToggleCameraType} />
            {imgUrl?.length > 0 && <ThumbnailImg source={{ uri: imgUrl }} />}

            {/* 슬라이더 구현 부분 */}
            <Slider
              style={{
                position: 'absolute',
                bottom: 100,
                alignSelf: 'center',
                width: '50%',
                height: 40,
              }} // 슬라이더의 스타일을 설정합니다.
              minimumValue={cameraPosition.minZoom} // 최소 줌 값으로 디바이스가 지원하는 최소 줌 값을 사용합니다.
              maximumValue={cameraPosition.maxZoom} // 최대 줌 값으로 디바이스가 지원하는 최대 줌 값을 사용합니다.
              value={zoom} // 현재 줌 값을 슬라이더의 value prop으로 설정합니다.
              onValueChange={onValueChange} // 슬라이더를 움직일 때 줌 상태를 업데이트합니다.
            />
          </View>
        </PinchGestureHandler>
      </GestureHandlerRootView>
    )
  );
};

export default CameraScreen;
