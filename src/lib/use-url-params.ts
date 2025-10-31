'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';

interface UseURLParamsOptions<
  T extends Record<string, string | number | boolean>,
> {
  paramMap: Record<keyof T, string>;
  storeValues: T;
  storeSetters: { [K in keyof T]?: (value: T[K]) => void };
  enabled?: boolean;
}

/**
 * Hook to sync calculator state with URL parameters
 *
 * @param paramMap - Object mapping store keys to URL param names
 * @param storeValues - Object with current store values
 * @param storeSetters - Object with store setter functions
 * @param enabled - Whether URL param syncing is enabled (default: true)
 */
export function useURLParams<
  T extends Record<string, string | number | boolean>,
>({
  paramMap,
  storeValues,
  storeSetters,
  enabled = true,
}: UseURLParamsOptions<T>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize/refresh store from URL params only when URL changes
  useEffect(() => {
    if (!enabled) return;

    for (const [storeKey, urlParamName] of Object.entries(paramMap)) {
      const paramValue = searchParams.get(urlParamName);
      if (paramValue !== null) {
        const setter = storeSetters[storeKey as keyof T];
        if (setter) {
          const currentValue = storeValues[storeKey as keyof T];
          let typedValue: T[keyof T];

          if (typeof currentValue === 'number') {
            typedValue = parseFloat(paramValue) as T[keyof T];
          } else if (typeof currentValue === 'boolean') {
            typedValue = (paramValue === 'true' ||
              paramValue === '1') as T[keyof T];
          } else {
            typedValue = decodeURIComponent(paramValue) as T[keyof T];
          }

          // Only update if changed to avoid loops
          if (typedValue !== currentValue) {
            setter(typedValue);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, searchParams]);

  // Update URL params from store values
  const updateURLParams = useCallback(
    (values: Partial<T>) => {
      if (!enabled) return;

      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [storeKey, urlParamName] of Object.entries(paramMap)) {
        const value =
          values[storeKey as keyof T] ?? storeValues[storeKey as keyof T];

        if (value !== undefined && value !== null && value !== '') {
          // Encode value for URL
          let encodedValue: string;
          if (typeof value === 'boolean') {
            encodedValue = value ? '1' : '0';
          } else if (typeof value === 'number') {
            encodedValue = value.toString();
          } else {
            // String - encode special characters but preserve commas
            encodedValue = encodeURIComponent(value.toString());
          }
          newSearchParams.set(urlParamName, encodedValue);
        } else {
          // Remove param if value is empty
          newSearchParams.delete(urlParamName);
        }
      }

      // Update URL without page reload
      router.replace(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [enabled, paramMap, storeValues, searchParams, router, pathname]
  );

  // Clear all URL params
  const clearURLParams = useCallback(() => {
    if (!enabled) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove all params that we manage
    for (const urlParamName of Object.values(paramMap)) {
      newSearchParams.delete(urlParamName);
    }

    // Update URL without page reload
    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    });
  }, [enabled, paramMap, searchParams, router, pathname]);

  return { updateURLParams, clearURLParams };
}
