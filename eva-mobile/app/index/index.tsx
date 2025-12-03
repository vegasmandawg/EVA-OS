import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Env } from "@/constants/env";
import { useApiKey } from "@/hooks/use-api-key";
import { cn } from "@/lib/utils";
import { getSimpleSolution } from "@/services/solution";
import { openURL } from "expo-linking";
import { getNetworkStateAsync } from "expo-network";
import { router } from "expo-router";
import { Loader2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInputChangeEvent,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "./logo";

export default function IndexScreen() {
  const { apiKey, setApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingKey, setIsCheckingKey] = useState(false);
  const [initedInputValue, setInitedInputValue] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (apiKey && !initedInputValue) {
      setInputValue(apiKey);
      setInitedInputValue(true);
    }
  }, [apiKey, initedInputValue]);

  const handleInputChange = (e: TextInputChangeEvent) => {
    setHasError(false);
    setInputValue(e.nativeEvent.text);
  };

  const onConfirm = async () => {
    if (!inputValue.trim()) {
      setHasError(true);
      setErrorMessage("请输入Solution Key");
      return;
    }
    if (!isValidSolutionKey(inputValue)) {
      setHasError(true);
      setErrorMessage("Solution Key格式不正确，请检查后重试");
      return;
    }
    const networkState = await getNetworkStateAsync();
    if (!networkState.isInternetReachable) {
      setHasError(true);
      setErrorMessage("网络连接失败，请检查网络后重试");
      return;
    }
    setIsCheckingKey(true);
    const previousKey = apiKey;
    await setApiKey(inputValue);
    const isKeyValid = await checkSolutionKey();
    setIsCheckingKey(false);
    if (!isKeyValid) {
      await setApiKey(previousKey);
      setHasError(true);
      setErrorMessage("Solution key无效，请检查后重试。");
      return;
    }
    router.push(`/chat/${inputValue}`);
  };

  const checkSolutionKey = async () => {
    console.log(apiKey);
    const res = await getSimpleSolution(apiKey);
    console.log(res);
    return !!res;
  };

  const isValidSolutionKey = (value: string) => {
    return /^sk-\w+$/gi.test(value);
  };

  const handleOpenEvaOsUrl = () => {
    openURL(Env.baseUrl);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };
  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <KeyboardAvoidingView behavior="height" className="flex-1">
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="flex-row items-center justify-end h-9 mb-3">
            <ThemeToggle />
          </View>
          <Logo />
          <Text className="text-2xl font-bold mb-3">欢迎使用EVA Test ✨</Text>
          <Text className="text-sm text-muted-foreground mb-10">
            请输入您从EVA OS平台获取的 Solution
            Key，系统将自动验证并连接对应的智能体。
          </Text>
          <Text className="text-base font-normal mb-2">Solution Key</Text>
          <View className="mb-3">
            <View className="relative mb-2">
              <Input
                className={cn(
                  "flex-1 h-12 border",
                  hasError && "border-destructive",
                  isInputFocused && "pr-8",
                  Platform.select({
                    android: "pb-0 pt-1",
                    ios: "leading-tight",
                  })
                )}
                placeholder="请输入Solution Key"
                textAlignVertical="center"
                placeholderClassName="text-sm text-muted-foreground"
                // clearButtonMode="while-editing"
                returnKeyLabel="确认"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                maxLength={50}
                {...Platform.select({
                  ios: {
                    scrollEnabled: true,
                  },
                  android: {},
                  web: {},
                })}
              />
              <View className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                {isInputFocused && inputValue.length > 0 && (
                  <Icon
                    as={X}
                    className="size-4 text-foreground"
                    onPress={() => setInputValue("")}
                  />
                )}
              </View>
            </View>
            <Text className="h-5 w-full text-sm text-destructive">
              {hasError ? errorMessage : ""}
            </Text>
          </View>
          <Button
            disabled={isCheckingKey || !inputValue.trim().length || hasError}
            onPress={onConfirm}
            className="w-full mb-4 h-11"
          >
            {isCheckingKey && (
              <View className="pointer-events-none animate-spin">
                <Icon as={Loader2} className="text-primary-foreground" />
              </View>
            )}
            <Text>{isCheckingKey ? "校验中" : "确认"}</Text>
          </Button>
          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-primary">还没有key?</Text>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="link" className="px-1">
                  <Text className="text-sm text-primary underline">
                    前往EVA OS创建
                  </Text>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-11/12">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    前往EVA OS创建
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    你将离开 EVA
                    Test，使用默认浏览器打开，是否允许打开外部链接？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>不允许</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction onPress={handleOpenEvaOsUrl}>
                    <Text>允许</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
