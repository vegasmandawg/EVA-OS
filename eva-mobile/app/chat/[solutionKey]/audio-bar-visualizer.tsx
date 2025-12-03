import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import {
  BarVisualizer,
  TrackReference,
  useLocalParticipant,
  useSpeakingParticipants,
} from "@livekit/react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function AudioBarVisualizer({ className }: { className?: string }) {
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [trackRef, setTrackRef] = useState<TrackReference | undefined>(
    undefined
  );
  const { microphoneTrack, localParticipant } = useLocalParticipant();
  const speakingParticipants = useSpeakingParticipants();
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    const isBotSpeaking = speakingParticipants.some(
      (participant) => participant.identity !== localParticipant?.identity
    );
    const isUserSpeaking = speakingParticipants.some(
      (participant) => participant.identity === localParticipant?.identity
    );
    setIsBotSpeaking(isBotSpeaking);
    setIsUserSpeaking(isUserSpeaking);
  }, [speakingParticipants, localParticipant]);

  useEffect(() => {
    if (microphoneTrack) {
      setTrackRef({
        participant: localParticipant,
        publication: microphoneTrack,
        source: microphoneTrack.source,
      });
    } else {
      setTrackRef(undefined);
    }
  }, [microphoneTrack, localParticipant]);

  return (
    <View className={cn("flex-col items-center justify-center", className)}>
      <BarVisualizer
        style={{ width: 40, height: 25 }}
        barCount={5}
        trackRef={trackRef}
        options={{
          minHeight: 0.25,
          maxHeight: 1,
          barColor: isDarkTheme ? "#fff" : "#000",
          barWidth: 4,
          barBorderRadius: 10,
        }}
      />
      <Text className="text-sm text-accent-foreground font-normal">
        {isBotSpeaking 
          ? "可通过说话打断" 
          : isUserSpeaking 
          ? "正在聆听中" 
          : "你可以开始说话"}
      </Text>
    </View>
  );
}
