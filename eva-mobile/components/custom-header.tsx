import { useNavigation } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { LayoutChangeEvent, TouchableOpacity, View } from "react-native";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

/**
 * Custom header component
 * @param {{
 *   title: string;
 *   showBackButton?: boolean;
 * }} props
 */
export default function CustomHeader({
  title,
  showBackButton = true,
  onLayout
}: {
  title: string;
  showBackButton?: boolean;
  onLayout?: (top: number) => void;
}) {
  const navigation = useNavigation();

  const canGoBack = showBackButton && navigation.canGoBack();

  const handleLayoutChange = (e: LayoutChangeEvent) => {
    const { y, height } = e.nativeEvent.layout;
    onLayout?.(y + height);
  }

  return (
    <View className="h-16 flex-row items-center justify-between px-4" onLayout={handleLayoutChange}>
      <View className="w-8 items-start">
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
            <Icon as={ChevronLeft} className="text-foreground size-7" />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1">
        <Text
          className="text-xl font-medium text-center text-ellipsis max-w-full px-1"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View className="w-8"></View>
    </View>
  );
}
