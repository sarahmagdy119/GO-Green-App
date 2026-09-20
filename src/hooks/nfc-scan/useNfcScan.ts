import { useCallback, useEffect, useRef, useState } from 'react';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await NfcManager.start();
    initialized = true;
  }
}

const SCAN_TIMEOUT_MS = 15000;

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

  const cancel = useCallback(() => {
    NfcManager.cancelTechnologyRequest().catch(() => {});
    if (mounted.current) setIsScanning(false);
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

      await Promise.race([
        NfcManager.requestTechnology([NfcTech.NfcA, NfcTech.Ndef]),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), SCAN_TIMEOUT_MS)
        ),
      ]);

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

  return { isScanning, error, scan, cancel };
}