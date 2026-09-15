import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'device_id';

function generateMacLikeId(): string {
  const bytes = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
  return bytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
}

export async function getDeviceId(): Promise<string> {
  const cached = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (cached) return cached;
  const id = generateMacLikeId();
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}