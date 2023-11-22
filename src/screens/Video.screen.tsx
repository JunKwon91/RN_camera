/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Camera, CameraDevice, useCameraDevice } from 'react-native-vision-camera';
import { styled } from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const CaptureBtn = styled.TouchableOpacity<{ isRecording: boolean }>`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${(props) => (props.isRecording ? 'red' : 'white')};
  bottom: 20px;
  align-self: center;
  align-items: center;
  justify-content: center;
`;
const CaptureBtnRed = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: red;
`;
const ChangeBtn = styled.TouchableOpacity`
  position: absolute;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 40px;
  background-color: blue;
  bottom: 35px;
  align-self: center;
  justify-content: center;
  align-items: center;
`;
const ThumbnailImg = styled.Image`
  position: absolute;
  bottom: 30px;
  right: 20px;
  width: 70px;
  height: 70px;
  border-radius: 5px;
`;

// 영상 녹화 버튼을 누르면 일시정지 버튼과 정지 버튼이 나오고
// 일시정지 버튼을 누르면 파일 저장 x, 정지 버튼을 누르면 파일이 저장
// 파일이 정상적으로 저장되면 화면 왼쪽에 썸네일 보여줌
const VideoScreen = () => {
  const [cameraPosition, setCameraPosition] = useState<CameraDevice>();
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false); // 카메라 전환여부
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const back = useCameraDevice('back'); // 후면 카메라
  const front = useCameraDevice('front'); // 전면 카메라
  const camera = useRef<Camera>(null);

  const onStartRecording = async () => {
    if (camera.current && !isRecording) {
      try {
        camera.current.startRecording({
          onRecordingFinished: (video) => {
            console.log('Recording finished: ', video.path);
            // Handle the recorded video file here
          },
          onRecordingError: (error) => {
            console.error('Recording Error: ', error);
          },
        });
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording: ', error);
      }
    }
  };

  const onStopRecording = async () => {
    if (camera.current && isRecording) {
      await camera.current.stopRecording();
      setIsRecording(false);
    }
  };

  const onToggleCameraType = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  useEffect(() => {
    if (front && back) {
      let _camera: CameraDevice = front;
      if (!isFrontCamera) {
        _camera = back;
      }
      setCameraPosition(_camera);
    }
  }, [back, front, isFrontCamera]);

  return Platform.OS === 'android' ? (
    cameraPosition && (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <Camera
          ref={camera}
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
          device={cameraPosition}
          isActive={true}
          video={true}
          // 오디오를 사용하기 위해선 오디오 권한을 허용해줘야 한다.
          // audio={true}
        /> */}
        <CaptureBtn
          isRecording={isRecording}
          onPress={isRecording ? onStopRecording : onStartRecording}
        >
          <CaptureBtnRed />
        </CaptureBtn>
        <ChangeBtn onPress={onToggleCameraType}>
          <Icon name={'refresh'} color={'white'} size={20} />
        </ChangeBtn>
      </View>
    )
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ flex: 1 }} />
      <CaptureBtn
        isRecording={isRecording}
        onPress={isRecording ? onStopRecording : onStartRecording}
      >
        <CaptureBtnRed />
      </CaptureBtn>
      <ChangeBtn onPress={onToggleCameraType}>
        <Icon name={'refresh'} color={'white'} size={20} />
      </ChangeBtn>
    </SafeAreaView>
  );
};

export default VideoScreen;
