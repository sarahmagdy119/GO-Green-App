import { create } from 'zustand';
import { AccessCheckResponse, TowelAccessCheckResponse } from '../types/scan.types';

interface TowelContext {
  cardSerial?: string;
  deviceId: string;
  roomId: string;
}

interface ScanState {
  result: AccessCheckResponse | null;
  towelResult: TowelAccessCheckResponse | null;
  towelContext: TowelContext | null;
  setResult: (result: AccessCheckResponse) => void;
  setTowelResult: (result: TowelAccessCheckResponse, context?: TowelContext) => void;
  clearResult: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  result: null,
  towelResult: null,
  towelContext: null,
  setResult: (result) => set({ result, towelResult: null, towelContext: null }),
setTowelResult: (towelResult, context) => {
  console.log('setTowelResult called with context:', context);
  set((state) => ({
    towelResult,
    towelContext: context ?? state.towelContext,
    result: null,
  }));
},
  clearResult: () => set({ result: null, towelResult: null, towelContext: null }),
}));