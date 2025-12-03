import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Icon } from "@/components/ui/icon";
import { useRoomConnectionState } from "@/hooks/use-room-connection-state";
import { ISimpleSolution } from "@/models/solution";
import {
  useLocalParticipant,
  useRoomContext,
  VideoTrack,
} from "@livekit/react-native";
import { mediaDevices } from "@livekit/react-native-webrtc";
import { Track } from "livekit-client";
import { Repeat } from "lucide-react-native";
import { useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import AudioBarVisualizer from "./audio-bar-visualizer";
import Controls from "./controls";
import SolutionInfo from "./solution-info";

type RoomViewProps = {
  disconnect?: () => void;
  solutionInfo?: ISimpleSolution | null;
};

export default function RoomView({ disconnect, solutionInfo }: RoomViewProps) {
  const [isFacingFront, setIsFacingFront] = useState(true);
  const {
    isCameraEnabled,
    isMicrophoneEnabled,
    localParticipant,
    cameraTrack: localCameraTrack,
  } = useLocalParticipant();
  const room = useRoomContext();

  useRoomConnectionState(room, localParticipant, disconnect);

  const localVideoTrack =
    localCameraTrack && isCameraEnabled
      ? {
          participant: localParticipant,
          publication: localCameraTrack,
          source: Track.Source.Camera,
        }
      : null;

  const switchCameraFacingMode = async () => {
    const newFacingMode = isFacingFront ? "environment" : "front";
    let devices: any = await mediaDevices.enumerateDevices();
    let newDevice: MediaDeviceInfo | null = null;
    for (const device of devices) {
      //@ts-ignore
      if (device.kind === "videoinput" && device.facing === newFacingMode) {
        newDevice = device;
        break;
      }
    }
    if (newDevice) {
      await room?.switchActiveDevice("videoinput", newDevice.deviceId);
      setIsFacingFront(!isFacingFront);
    }
  };

  return (
    <View className="flex-1 flex-col items-center justify-between">
      {localVideoTrack ? (
        <View className="relative w-full">
          <AspectRatio
            className="justify-center items-center w-full rounded-md overflow-hidden"
            ratio={2 / 3}
          >
            <Animated.View className="w-full h-full">
              <VideoTrack
                trackRef={localVideoTrack}
                style={{ width: "100%", height: "100%" }}
              />
            </Animated.View>
          </AspectRatio>
          <TouchableOpacity
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-background/50 rounded flex items-center justify-center"
            onPress={switchCameraFacingMode}
          >
            <Icon as={Repeat} className="size-5" />
          </TouchableOpacity>
        </View>
      ) : (
        <SolutionInfo
          className="pt-20"
          detail=""
          avatar={solutionInfo?.metadata.iconBackground}
          icon={solutionInfo?.metadata.icon}
          animate={true}
        />
      )}
      <View className="flex-1 flex-col items-center justify-end">
        <AudioBarVisualizer className="mb-8" />
        <Controls
          disconnect={disconnect}
          localParticipant={localParticipant}
          isMicrophoneEnabled={isMicrophoneEnabled}
          isCameraEnabled={isCameraEnabled}
        />
      </View>
    </View>
  );
}
