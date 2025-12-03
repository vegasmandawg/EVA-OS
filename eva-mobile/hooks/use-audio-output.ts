import { AudioSession } from '@livekit/react-native';
import { mediaDevices } from '@livekit/react-native-webrtc';
import { useCallback, useEffect, useState } from 'react';
import { usePlatform } from './use-platform';

// 定义设备信息的类型
export interface AudioOutputDevice {
  deviceId: string;
  label: string;
  kind: string;
}

// for android only
export enum AudioOutputMode {
  Speaker = "speaker",
  Earpiece = "earpiece",
  Bluetooth = "bluetooth",
}

export class AudioOutputDevice {
  deviceId: string;
  label: string;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
    switch (deviceId) {
      case AudioOutputMode.Speaker:
        this.label = "扬声器";
        break;
      case AudioOutputMode.Earpiece:
        this.label = "听筒";
        break;
      case AudioOutputMode.Bluetooth:
        this.label = "蓝牙设备";
        break;
      default:
        this.label = "未知设备";
        break;
    }
  }
}

export const useAudioOutput = () => {
  const [audioOutputDevices, setAudioOutputDevices] = useState<AudioOutputDevice[]>([]);
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<AudioOutputDevice | null>(null);
  const { isIOS, isAndroid } = usePlatform();

  const updateDeviceList = useCallback(async () => {
    if (isIOS) {

    }
    if (isAndroid) {
      const allAudioOutputs = await AudioSession.getAudioOutputs();
      const audioOutputList = allAudioOutputs.map(output => new AudioOutputDevice(output));
      setAudioOutputDevices(audioOutputList);
      setSelectedAudioOutput(audioOutputList.find(output => output.deviceId === allAudioOutputs[0]) || null);
    }
  }, [isAndroid, isIOS]);

  const switchAudioOutput = useCallback(async (deviceId: string) => {
    try {
      if (isAndroid) {
        await AudioSession.selectAudioOutput(deviceId);
        setSelectedAudioOutput(audioOutputDevices.find(output => output.deviceId === deviceId) || null);
      }
    } catch (error) {
      console.error('切换音频输出失败:', error);
    }
  }, [isAndroid, audioOutputDevices]);

  useEffect(() => {
    updateDeviceList();

    const listener = (p: any) => {
      console.log('媒体设备发生变化', p);
      updateDeviceList();
    };
    (mediaDevices as any).addEventListener('devicechange', listener);

    return () => {
      (mediaDevices as any).removeEventListener('devicechange', listener);
    };
  }, [updateDeviceList]);

  return { audioOutputDevices, selectedAudioOutput, switchAudioOutput, updateDeviceList };
};