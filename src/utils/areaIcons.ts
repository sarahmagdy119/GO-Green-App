import { Ionicons } from '@expo/vector-icons';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  RESTAURANT: 'restaurant-outline',
  POOL: 'water-outline',
  GYM: 'barbell-outline',
};

export function getAreaIcon(type: string): keyof typeof Ionicons.glyphMap {
  return ICON_MAP[type] ?? 'location-outline';
}