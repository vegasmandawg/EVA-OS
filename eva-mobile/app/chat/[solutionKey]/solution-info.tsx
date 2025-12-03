import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

export type SolutionInfoProps = {
  detail?: string;
  avatar?: string;
  icon?: string;
  animate?: boolean;
  className?: string;
};

export default function SolutionInfo({
  detail,
  avatar,
  icon,
  animate = false,
  className,
}: SolutionInfoProps) {
  const [applyAnimation, setApplyAnimation] = useState(false);
  const hasDetail = useMemo(() => !!detail, [detail]);

  useEffect(() => {
    if (animate) {
      let timer = setTimeout(() => {
        setApplyAnimation(true);
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setApplyAnimation(true);
    }
  }, [animate]);
  
  return (
    <View className={cn("flex flex-col items-center justify-center px-3", className)}>
      <View
        className={cn(
          "w-72 h-72 p-2 mb-4 rounded-full transition-all duration-200 ease-in-out",
          applyAnimation && !hasDetail && "mb-0 w-80 h-80"
        )}
      >
        <View className="w-full h-full bg-accent rounded-full items-center justify-center">
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-full"
            />
          ) : (
            <Text
              className={cn(
                "text-accent-foreground",
                hasDetail ? "text-6xl" : "text-8xl",
                "leading-tight"
              )}
            >
              {icon || "AS"}
            </Text>
          )}
        </View>
      </View>
      {hasDetail && (
        <Text className="text-sm text-muted-foreground">{detail}</Text>
      )}
    </View>
  );
}