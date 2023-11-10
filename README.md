## ※ 디바이스의 카메라를 사용해보자!

### ▪ Setting Guide

**[ install ]**

&nbsp;- [**react-native-vision-camera**](https://react-native-vision-camera.com/)
: 카메라 화면을 보여주는데 사용

```
npm i react-native-vision-camera
```

<br>

&nbsp;- `Android` / `iOS` 별도로 셋팅!
<br>

<img src="https://img.shields.io/badge/Android- ?style=&logo=android&logoColor=white" />

- `android/app/src/main/AndroidManifest.xml`파일에 Camera사용을 위한 권한을 추가하다.

```xml
<uses-permission android:name="android.permission.CAMERA" />

<!-- optionally, if you want to record audio: -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

---

<img src="https://img.shields.io/badge/iOS-gray?style=&logo=apple&logoColor=white" />

- `info.plist`에 권한 사용에 대한 설명 작성!

```vbnet
<key>NSCameraUsageDescription</key>
<string>$(PRODUCT_NAME) needs access to your Camera.</string>

<!-- optionally, if you want to record audio: -->
<key>NSMicrophoneUsageDescription</key>
<string>$(PRODUCT_NAME) needs access to your Microphone.</string>
```

- `pod install`를 실행!  
   이 구성을 업데이트할 때마다 반드시 다시 `pod install`해야 한다.

<br>

&nbsp;- [**@react-native-camera-roll/camera-roll**](https://github.com/react-native-cameraroll/react-native-cameraroll)
: 카메라 찍은 결과물 저장하는데 사용

```
npm install @react-native-camera-roll/camera-roll --save
```

<br>

&nbsp;- [**react-native-gesture-handler**](https://github.com/software-mansion/react-native-gesture-handler)
: 손가락을 사용한 zoom기능 구현하는데 사용

```
npm i react-native-gesture-handler
```

</aside>

<br>

### ▪ Usage

### # First.screen.tsx

- 사용자에게 카메라 접근 권한을 확인한다.

```typescript
//* Hooks ------------------------------------------------------------------
const { hasPermission, requestPermission } = useCameraPermission();

//* Lifecycle ------------------------------------------------------------
useEffect(() => {
  if (!hasPermission) {
    requestPermission();
  }
}, []);
```

- **hasPermission**: 라이브러리에서 제공하는 카메라 접근 권한 수락 여부
- **useCameraPermission**: 라이브러리에서 제공하는 카메라 접근권한 확인 Hook

---

### # Camera.screen.tsx

- 카메라 화면을 보여준다.
- 전면/후면 카메라 전환, 카메라 zoom 기능, 사진 촬영 기능 구현

[ **UI** ]

```typescript
return (
  cameraPosition && (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <View style={{ flex: 1 }}>
          {/* Camera */}
          <Camera
            ref={cameraRef}
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
            device={cameraPosition}
            isActive={true}
            zoom={zoom}
            photo={true}
          />

          {/* 사진촬영 버튼 */}
          <CaptureBtn onPress={onPhoto} />

          {/* 전면/후면 카메라 전환 버튼 */}
          <ChangeBtn onPress={onToggleCameraType} />

          {/* 촬영한 사진의 썸네일 */}
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
```

<br>

[ **카메라 zoom 기능** ]

```typescript
// Zoom 구현
const [zoom, setZoom] = useState(0); // 현재 줌 레벨을 저장
const lastZoom = useRef(1); // 핀치 제스처가 시작되기 전의 기준 줌 레벨을 저장

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
```

- **`onPinchGestureEvent`**: 핀치 제스처 이벤트를 처리 함수
  - 사용자가 화면을 핀치할 때, `event.nativeEvent.scale` 값에 기초하여 새로운 줌 레벨을 계산
  - 이 새로운 줌의 레벨 값이 카메라의 최소(`minZoom`)와 최대(`maxZoom`) 줌 범위를 넘지 않도록 제한
  - `State.ACTIVE`는 제스처가 현재 활성화 여부
- **`onPinchHandlerStateChange`**: 핀치 제스처의 상태 변경을 처리하는 함수
  - 제스처가 활성 상태에서 벗어날 때(`State.ACTIVE`)에서 다른 상태로 전환될 때),
    이 함수는 현재 줌 레벨을 `lastZoom`에 저장하여 다음 핀치 작업의 기준점으로 설정
- **`onValueChange`**: 슬라이더 콜백 함수는 슬라이더를 사용하여 줌 값을 조절할 때 호출 - 슬라이더를 움직이면, 이 함수가 호출되어 `zoom` 상태를 업데이트하고,
  `lastZoom ref`도 새로운 `zoom` 값으로 설정

<br>

[ **전면/후면 카메라 전환** ]

```typescript
// Status
const [cameraPosition, setCameraPosition] = useState<CameraDevice>();
const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false); // 카메라 전환여부
const [imgUrl, setImgUrl] = useState<string>('');

// Hook
const back = useCameraDevice('back'); // 후면 카메라
const front = useCameraDevice('front'); // 전면 카메라

// 카메라 전환
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
```

- **useCameraDevice:** 현재 사용 가능한 카메라의 타입(전면, 후면), 상태(로딩, 에러, 준비 완료) 등을 접근할 수 있게 해 준다.
  <br>

[ **사진 촬영 기능** ]

```tsx
const onPhoto = async () => {
  const photo = await cameraRef?.current?.takePhoto({
    flash: 'auto', // 'auto' | 'off'
    enableShutterSound: false, // 셔터소리
  });

  // 사진 저장
  await CameraRoll.save(`file://${photo?.path}`, {
    type: 'photo',
  });

  setImgUrl(`file://${photo?.path}`);
};
```

- **takePhoto: `takePhoto`** 함수는 카메라가 현재 프레임을 캡처하여 사진으로 만드는 비동기 함수로,
  완료되면 사진에 대한 정보(예: 파일 경로, 크기, 타임스탬프 등)를 포함하는 객체를 반환한다.
- **CameraRoll.save: `CameraRoll`** 모듈은 React Native 애플리케이션에서 사용자의 사진첩에 접근하여 사진이나 비디오를 저장하고 불러올 수 있게 해주는 기능을 제공하며,
  **`CameraRoll.save`** 메서드를 통해 로컬 파일 시스템에 있는 이미지나 비디오를 사진첩에 저장할 수 있다.

---

### # Qr.screen.tsx

- QRCode를 인식하여 처리하기 위한 카메라 구현
- **iOS**에서 코드 스캐너는 플랫폼 기반 API를 사용하며 즉시 사용할 수 있다.
  **Android**에서는 [MLKit Vision Barcode Scanning](https://developers.google.com/ml-kit/vision/barcode-scanning) API가 사용되며, 모델(2.2MB)을 다운로드해야 한다. - 사용자가 앱을 설치할 때 모델을 다운로드하려면 다음을 `AndroidManifest.xml`파일에 추가하세요.

  ```xml
  <application ...>
     ...
     <meta-data
        android:name="com.google.mlkit.vision.DEPENDENCIES"
        android:value="barcode" />
  </application>
  ```

  <br>

[ **UI** ]

```tsx
return (
  cameraPosition && (
    <>
      <Camera
        ref={cameraRef}
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
        device={cameraPosition}
        isActive={true}
        photo={true}
        **codeScanner={onCodeScanner}**
      />
      <ChangeBtn onPress={onToggleCameraType} />
    </>
  )
);
```

- **codeScanner={onCodeScanner}**: 바코드 또는 QR 코드를 성공적으로 스캔했을 때 호출되는 함수

<br>

[ **QRCode 데이터 처리** ]

```tsx
// QRCode 스캐닝
const [message, setMessage] = useState<string>(''); // 받아온 QR 문자열 저장
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
```

- 제공되는 **`useCodeScanner`** 를 사용하여 성공적으로 받아온 QRCode를 사용하여 데이터 처리를 해준다.

<br>

---

<br>

**[예제 실행 화면]**  
<img src="" width="20%" height="auto" alt="AlertModlal" />
