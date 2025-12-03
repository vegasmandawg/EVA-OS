import {
  PermissionStatus,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { useEffect, useState } from "react";

export function usePermission() {
  const [isCameraGranted, setIsCameraGranted] = useState(false);
  const [isCameraDenied, setIsCameraDenied] = useState(false);
  const [isMicrophoneGranted, setIsMicrophoneGranted] = useState(false);
  const [isMicrophoneDenied, setIsMicrophoneDenied] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  useEffect(() => {
    const curCameraGranted =
      cameraPermission?.status === PermissionStatus.GRANTED;
    const curCameraDenied = cameraPermission?.status === PermissionStatus.DENIED;
    const curMicrophoneGranted =
      microphonePermission?.status === PermissionStatus.GRANTED;
    const curMicrophoneDenied =
      microphonePermission?.status === PermissionStatus.DENIED;
    setIsCameraGranted(curCameraGranted);
    setIsCameraDenied(curCameraDenied);
    setIsMicrophoneGranted(curMicrophoneGranted);
    setIsMicrophoneDenied(curMicrophoneDenied);
  }, [cameraPermission, microphonePermission]);

  const requestCameraPermissionFn = async () => {
    const cameraPermission = await requestCameraPermission();
    if (cameraPermission.status === PermissionStatus.GRANTED) {
      setIsCameraGranted(true);
    }
    return cameraPermission.status === PermissionStatus.GRANTED;
  };

  const requestMicrophonePermissionFn = async () => {
    const microphonePermission = await requestMicrophonePermission();
    if (microphonePermission.status === PermissionStatus.GRANTED) {
      setIsMicrophoneGranted(true);
    }
    return microphonePermission.status === PermissionStatus.GRANTED;
  };

  return {
    isCameraGranted,
    isCameraDenied,
    isMicrophoneGranted,
    isMicrophoneDenied,
    requestCameraPermission: requestCameraPermissionFn,
    requestMicrophonePermission: requestMicrophonePermissionFn,
  };
}
