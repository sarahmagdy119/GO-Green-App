export interface ScannedCardPayload {
  cardSerial: string;
  deviceId: string;
  roomId: string;
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

export interface AccessCheckResponse {
  allowed: boolean;
  reason?: string;
  allowedAreas: AllowedArea[];
  reservationDetails?: ReservationDetails;
}