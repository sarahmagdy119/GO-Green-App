import { useCallback, useEffect, useRef, useState } from 'react';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await NfcManager.start();
    initialized = true;
  }
}

export function useNfcScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  const scan = useCallback(async (): Promise<string | null> => {
    setError(null);
    setIsScanning(true);
    try {
      await ensureInit();

      const supported = await NfcManager.isSupported();
      if (!supported) {
        setError('scan.notSupported');
        return null;
      }

      await NfcManager.requestTechnology([NfcTech.NfcA, NfcTech.Ndef]);
      const tag = await NfcManager.getTag();
      const rawId = tag?.id ?? null;
      if (!rawId) {
        setError('scan.failed');
        return null;
      }
      return rawId.replace(/:/g, '').toUpperCase();
    } catch (err) {
      if (mounted.current) setError('scan.failed');
      return null;
    } finally {
      if (mounted.current) setIsScanning(false);
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }, []);

  return { isScanning, error, scan };
}