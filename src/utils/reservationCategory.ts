const CATEGORY_LABELS: Record<string, string> = {
  HB: 'Half Board',
  FB: 'Full Board',
  BB: 'Bed & Breakfast',
  RO: 'Room Only',
  AI: 'All Inclusive',
};

export function getReservationCategoryLabel(code: string): string {
  return CATEGORY_LABELS[code] ?? code;
}