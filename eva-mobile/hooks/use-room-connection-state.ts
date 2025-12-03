import { toast } from "@/components/sonner";
import { useNetworkState } from "expo-network";
import {
  ConnectionQuality,
  DisconnectReason,
  LocalParticipant,
  Participant,
  Room,
  RoomEvent
} from "livekit-client";
import { useCallback, useEffect, useRef } from "react";

const LOST_CONNECTION_DURATION_THRESHOLD = 15;

export const useRoomConnectionState = (
  room?: Room,
  localParticipant?: LocalParticipant,
  disconnect?: () => void
) => {
  const networkState = useNetworkState();
  const lostConnectionDurationRef = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lostConnectionTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    timer.current = setTimeout(() => {
      lostConnectionDurationRef.current++;
      if (lostConnectionDurationRef.current >= LOST_CONNECTION_DURATION_THRESHOLD) {
        disconnect?.();
        return;
      }
      lostConnectionTimer();
    }, 1000);
  }, [disconnect]);

  useEffect(() => {
    if (!room) return;
    let toastId: string | number;
    const handleConnectionQualityChanged = (
      connectionQuality: ConnectionQuality,
      participant: Participant
    ) => {
      if (participant.identity !== localParticipant?.identity) {
        return;
      }
      if (connectionQuality === ConnectionQuality.Poor) {
        toastId !== undefined && toast.dismiss(toastId);
        toastId = toast.error("当前网络环境差，建议切换网络或挂断重试", {
          duration: 3000,
        });
      }
      if (
        connectionQuality === ConnectionQuality.Excellent ||
        connectionQuality === ConnectionQuality.Good
      ) {
        toastId !== undefined && toast.dismiss(toastId);
      }
    };

    const handleDisconnected = (reason?: DisconnectReason) => {
      toastId !== undefined && toast.dismiss(toastId);
      disconnect?.();
    };
    const handleParticipantDisconnected = (participant: Participant) => {
      toastId !== undefined && toast.dismiss(toastId);
      disconnect?.();
    };
    const handleReconnecting = () => {
      toastId !== undefined && toast.dismiss(toastId);
      toastId = toast.loading("网络异常无法连接，尝试重连...", {
        duration: Infinity,
      });
    };
    room.addListener(RoomEvent.Reconnecting, handleReconnecting);
    room.addListener(
      RoomEvent.ConnectionQualityChanged,
      handleConnectionQualityChanged
    );
    room.addListener(RoomEvent.Disconnected, handleDisconnected);
    room.addListener(
      RoomEvent.ParticipantDisconnected,
      handleParticipantDisconnected
    );
    return () => {
      room.removeListener(RoomEvent.Reconnecting, handleReconnecting);
      room.removeListener(
        RoomEvent.ConnectionQualityChanged,
        handleConnectionQualityChanged
      );
      room.removeListener(RoomEvent.Disconnected, handleDisconnected);
      room.removeListener(
        RoomEvent.ParticipantDisconnected,
        handleParticipantDisconnected
      );
      toastId !== undefined && toast.dismiss(toastId);
    };
  }, [room, disconnect, localParticipant?.identity]);

  useEffect(() => {
    let toastId: string | number;
    const isConnected = networkState.isConnected;
    const isInternetReachable = networkState.isInternetReachable;
    if (isConnected === false || isInternetReachable === false) {
      toastId = toast.loading("网络异常无法连接，尝试重连...", {
        duration: Infinity,
      });
      lostConnectionTimer();
    }
    if (isConnected === true && isInternetReachable === true) {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      lostConnectionDurationRef.current = 0;
    }
    return () => {
      toastId !== undefined && toast.dismiss(toastId);
    };
  }, [networkState, lostConnectionTimer]);

  return {
    networkState,
  };
};
