import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'device_id';

export async function getDeviceId(): Promise<string> {
  const cached = await AsyncStorage.getItem(DEVICE_ID_KEY);
  return cached ?? '';
}

export async function setDeviceId(deviceId: string): Promise<void> {
  await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
}