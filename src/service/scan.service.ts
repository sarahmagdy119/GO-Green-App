// service/scan.service.ts
import {
  AccessCheckResponse,
  BulkReturnResult,
  ScannedCardPayload,
  TowelAccessCheckResponse,
  TowelLogsResponse,
  TowelSubmitPayload,
  TowelSubmitResponse,
  TowelSummaryResponse,
} from '../types/scan.types';
import { api } from './api';

export async function checkAccess(payload: ScannedCardPayload): Promise<AccessCheckResponse> {
  const { data } = await api.post<AccessCheckResponse>('/scan', payload);
  return data;
}

export async function checkTowelAccess(payload: ScannedCardPayload): Promise<TowelAccessCheckResponse> {
  const { data } = await api.post<TowelAccessCheckResponse>('/scan', payload);
  return data;
}

export async function submitTowelMovement(payload: TowelSubmitPayload): Promise<TowelSubmitResponse> {
  const { data } = await api.post<TowelSubmitResponse>('/towels/submit', payload);
  return data;
}

export async function getTowelSummary(lng: string): Promise<TowelSummaryResponse> {
  const { data } = await api.get<TowelSummaryResponse>('/towels/summary', {
    headers: { lng },
  });
  return data;
}

export interface TowelLogsQuery {
  roomId?: string;
  reservationId?: string;
  status?: 'IN' | 'OUT';
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export async function getTowelLogs(
  query: TowelLogsQuery,
  lng: string
): Promise<TowelLogsResponse> {
  const { data } = await api.get<TowelLogsResponse>('/towels/logs', {
    params: query,
    headers: { lng },
  });
  return data;
}

export async function bulkReturnTowels(
  roomIds: string[],
  lng: string
): Promise<{ results: BulkReturnResult[] }> {
  const { data } = await api.post<{ results: BulkReturnResult[] }>(
    '/towels/bulk-return',
    { roomIds },
    { headers: { lng } }
  );
  return data;
}