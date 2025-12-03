import AsyncStorageLib from '@react-native-async-storage/async-storage';

export default class AsyncStorage {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorageLib.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorageLib.getItem(key);
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  static async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorageLib.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing object:', error);
    }
  }

  static async getObject(key: string): Promise<any | null> {
    try {
      const jsonValue = await AsyncStorageLib.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving object:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorageLib.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorageLib.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
