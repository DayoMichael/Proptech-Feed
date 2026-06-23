"use client";

import { useEffect, useState } from "react";

export interface NetworkStatus {
  saveData: boolean;
  effectiveType: string;
  /** True when the user opted into Save-Data or is on a slow (2g) connection. */
  dataSaver: boolean;
}

interface ConnectionLike extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
}

const DEFAULT: NetworkStatus = {
  saveData: false,
  effectiveType: "4g",
  dataSaver: false,
};

function read(conn: ConnectionLike): NetworkStatus {
  const saveData = Boolean(conn.saveData);
  const effectiveType = conn.effectiveType ?? "4g";
  const slow = effectiveType === "slow-2g" || effectiveType === "2g";
  return { saveData, effectiveType, dataSaver: saveData || slow };
}

/**
 * Reads the Network Information API to drive Data Saver behaviour
 * (lower image quality, no video preload/autoplay) on slow/metered networks.
 * Falls back to a fast-connection default where the API is unavailable.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(DEFAULT);

  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: ConnectionLike }
    ).connection;
    if (!conn) return;

    const update = () => setStatus(read(conn));
    update();
    conn.addEventListener("change", update);
    return () => conn.removeEventListener("change", update);
  }, []);

  return status;
}
