import { toast } from "@/components/sonner";
import { Icon } from "@/components/ui/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { AudioOutputMode, useAudioOutput } from "@/hooks/use-audio-output";
import { usePermission } from "@/hooks/use-permission";
import { usePlatform } from "@/hooks/use-platform";
import { cn } from "@/lib/utils";
import { AudioSession } from "@livekit/react-native";
import { TriggerRef } from "@rn-primitives/popover";
import { useNetworkState } from "expo-network";
import { LocalParticipant } from "livekit-client";
import {
  Bluetooth,
  Ear,
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
  Volume2,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  DeviceEventEmitter,
  Easing,
  Linking,
  TouchableOpacity,
  View
} from "react-native";

type ControlsProps = {
  disconnect?: () => void;
  localParticipant?: LocalParticipant;
  isMicrophoneEnabled?: boolean;
  isCameraEnabled?: boolean;
};

export default function Controls({
  disconnect,
  localParticipant,
  isMicrophoneEnabled,
  isCameraEnabled,
}: ControlsProps) {
  const { isCameraGranted, isCameraDenied, requestCameraPermission } =
    usePermission();
  const audioTriggerRef = useRef<TriggerRef | null>(null);
  const { isIOS, isAndroid } = usePlatform();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(-100)).current;
  const { audioOutputDevices, selectedAudioOutput, switchAudioOutput, updateDeviceList } =
    useAudioOutput();
  const networkState = useNetworkState();

  useEffect(() => {
    const duration = 150;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.bounce),
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: 0,
        duration,
        easing: Easing.inOut(Easing.bounce),
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, translateXAnim]);

  useEffect(() => {
    DeviceEventEmitter.addListener("onAudioDeviceChanged", (event) => {
      console.log("device event emitter", event.availableAudioDeviceList);
    });
  }, []);

  useEffect(() => {
    let toastId = null;
    if (isCameraDenied) {
      toastId = toastCameraPermissionDenied();
    }
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isCameraDenied]);

  const audioIcon = useCallback((deviceId: string, className: string = "") => {
    switch (deviceId) {
      case AudioOutputMode.Speaker:
        return (
          <Icon as={Volume2} className={cn("text-primary size-5", className)} />
        );
      case AudioOutputMode.Earpiece:
        return (
          <Icon as={Ear} className={cn("text-primary size-5", className)} />
        );
      case AudioOutputMode.Bluetooth:
        return (
          <Icon
            as={Bluetooth}
            className={cn("text-primary size-5", className)}
          />
        );
      default:
        return (
          <Icon as={Volume2} className={cn("text-primary size-5", className)} />
        );
    }
  }, []);

  const audioOutputList = useMemo(() => {
    return (
      <View className="p-0">
        {audioOutputDevices.map((output) => (
          <TouchableOpacity
            key={output.deviceId}
            onPress={() => {
              audioTriggerRef.current?.close();
              switchAudioOutput(output.deviceId);
            }}
            className="flex-row h-8 items-center gap-x-2"
          >
            {audioIcon(output.deviceId, "text-muted-foreground, size-4")}
            <Text className="text-sm text-muted-foreground">
              {output.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [audioIcon, audioOutputDevices, switchAudioOutput]);

  const microphoneIcon = useMemo(() => {
    return (
      <Icon
        as={isMicrophoneEnabled ? Mic : MicOff}
        className={cn(
          "size-5",
          isMicrophoneEnabled ? "text-primary" : "text-destructive"
        )}
      />
    );
  }, [isMicrophoneEnabled]);

  const phoneOffIcon = useMemo(() => {
    return <Icon as={Phone} className="text-white size-5 rotate-[135deg]" />;
  }, []);

  const videoIcon = useMemo(() => {
    return (
      <Icon
        as={isCameraEnabled ? Video : VideoOff}
        className={cn(
          "size-5",
          isCameraEnabled ? "text-primary" : "text-destructive"
        )}
      />
    );
  }, [isCameraEnabled]);

  const onAudioRoutePickerClick = async () => {
    if (!networkState.isInternetReachable || !networkState.isConnected) return;
    if (isIOS) {
      await AudioSession.showAudioRoutePicker();
    }
  };

  const onMicClick = () => {
    if (!networkState.isInternetReachable || !networkState.isConnected) return;
    localParticipant?.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const onPhoneOffClick = () => {
    localParticipant?.setMicrophoneEnabled(false);
    localParticipant?.setCameraEnabled(false);
    disconnect?.();
  };

  const onVideoClick = async () => {
    if (!networkState.isInternetReachable || !networkState.isConnected) return;
    if (!isCameraGranted) {
      const result = await requestCameraPermission();
      if (!result) {
        toastCameraPermissionDenied();
        return;
      }
    }
    localParticipant?.setCameraEnabled(!isCameraEnabled);
  };

  const toastCameraPermissionDenied = () => {
    return toast(
      "您已拒绝相机权限，如需使用视频功能，请在系统设置中打开权限",
      {
        action: {
          label: "去设置",
          onClick: () => {
            Linking.openSettings();
          },
        },
        variant: "none",
        duration: 3000,
      }
    );
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { translateX: translateXAnim }],
      }}
      className="flex-row gap-x-8"
    >
      {isAndroid && (
        <TouchableOpacity className="flex-1 items-center justify-center bg-accent rounded-full aspect-square">
          <Popover className="flex-1 w-full" onOpenChange={updateDeviceList}>
            <PopoverTrigger
              disabled={!networkState.isInternetReachable || !networkState.isConnected}
              ref={audioTriggerRef}
              className="flex-1 rounded-full items-center justify-center"
            >
              {audioIcon(selectedAudioOutput?.deviceId || "")}
            </PopoverTrigger>
            <PopoverContent
              className="w-28 py-0 px-0 pl-3 translate-x-1/4"
              side="top"
            >
              {audioOutputList}
            </PopoverContent>
          </Popover>
        </TouchableOpacity>
      )}
      {isIOS && (
        <TouchableOpacity
          onPress={onAudioRoutePickerClick}
          className="flex-1 items-center justify-center bg-accent rounded-full aspect-square"
        >
          {/* {audioOutputModeIcon} */}
          <Icon as={Volume2} className="text-primary size-5" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-accent rounded-full aspect-square"
        onPress={onMicClick}
      >
        {microphoneIcon}
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-destructive rounded-full aspect-square"
        onPress={onPhoneOffClick}
      >
        {phoneOffIcon}
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-accent rounded-full aspect-square"
        onPress={onVideoClick}
      >
        {videoIcon}
      </TouchableOpacity>
    </Animated.View>
  );
}
