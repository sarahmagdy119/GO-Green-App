import { create } from 'zustand';
import { AccessCheckResponse } from '../types/scan.types';

interface ScanState {
  result: AccessCheckResponse | null;
  setResult: (result: AccessCheckResponse) => void;
  clearResult: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
}));