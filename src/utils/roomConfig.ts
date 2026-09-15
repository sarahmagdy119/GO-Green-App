import AsyncStorage from '@react-native-async-storage/async-storage';

const ROOM_ID_KEY = 'terminal_room_id';

export async function getRoomId(): Promise<string> {
  const roomId = await AsyncStorage.getItem(ROOM_ID_KEY);
  return roomId ?? '';
}

export async function setRoomId(roomId: string): Promise<void> {
  await AsyncStorage.setItem(ROOM_ID_KEY, roomId);
}