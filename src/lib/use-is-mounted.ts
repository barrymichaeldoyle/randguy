'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if component has mounted on the client side.
 * Useful for preventing SSR rendering issues with components that need DOM measurements,
 * such as ResponsiveContainer from recharts.
 *
 * @returns true if component has mounted on the client, false during SSR
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return isMounted;
}
