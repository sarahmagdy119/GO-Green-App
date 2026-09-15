import { AccessCheckResponse, ScannedCardPayload } from '../types/scan.types';
import { api } from './api';

export async function checkAccess(payload: ScannedCardPayload): Promise<AccessCheckResponse> {
  // TODO: اتأكدي من الـ endpoint الحقيقي
  const { data } = await api.post<AccessCheckResponse>('/scan', payload);
  return data;
}