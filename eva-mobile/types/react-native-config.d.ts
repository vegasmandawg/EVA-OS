declare module "react-native-config" {
  export interface NativeConfig {
    WSS_URL?: string;
    BASE_URL?: string;
    TOKEN?: string;
    DEFAULT_API_KEY?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
