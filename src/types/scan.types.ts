export interface ScannedCardPayload {
  cardSerial?: string;
  roomNumber?: string;
  deviceId: string;
  roomId: string;
}

export interface AccessCheckResponse {
  allowed: boolean;
  reason?: string;
  allowedAreas: {
    id: number;
    name: string;
    type: string;
  }[];
  reservationDetails?: {
    guestName: string;
    roomNumber: number;
    allowedCompanions: number;
    reservationCategory: string;
    checkIn: string;
    checkOut: string;
  };
}

export interface AllowedArea {
  id: number;
  name: string;
  type: string;
}

export interface ReservationDetails {
  guestName: string;
  roomNumber: number;
  allowedCompanions: number;
  reservationCategory: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  reservationSource?: string;
}

// ---- Towel management ----

export interface TowelDetails {
  taken: number;
  allowed: number;
  remaining: number;
}

// roomNumber here is a string, confirmed from the real /api/towels endpoints —
// deliberately kept separate from ReservationDetails (used by the restaurant/allowed flow),
// which uses roomNumber: number.
export interface TowelReservationDetails {
  guestName: string;
  roomNumber: string;
  allowedCompanions: number;
  adultsCount?: number;
  childrenCount?: number;
  reservationCategory: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  reservationSource?: string;
}

export interface TowelAccessCheckResponse {
  reservationDetails: TowelReservationDetails;
  towelDetails: TowelDetails;
}

export type TowelStatus = 'IN' | 'OUT';

export interface TowelSubmitPayload {
  cardSerial?: string;
  deviceId: string;
  quantity: number;
  status: TowelStatus;
  roomId: string;
}

export interface TowelSubmitResponse {
  reservationId: string;
  roomId: string;
  guestName: string;
  towelDetails: TowelDetails;
}
export interface TowelSummaryItem {
  roomId: string;
  reservationId: string;
  guestName: string;
  area?: string;
  towelsOut: number;
}

export interface TowelSummaryResponse {
  activeRooms: number;
  towelsOut: number;
  items: TowelSummaryItem[];
}

export type TowelLogEventType = 'IN' | 'OUT';

export interface TowelLogItem {
  id: string;
  roomId: string;
  status: TowelLogEventType;
  quantity: number;
  location?: string;
  createdAt: string;
}

export interface TowelLogsResponse {
  items: TowelLogItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BulkReturnResult {
  roomId: string;
  success: boolean;
  reservationId?: string;
  returned?: number;
  error?: string;
}