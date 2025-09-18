import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

type WishlistSymbol = string;

const STORAGE_KEY = 'wishlist_symbols_v1';

export function useWishlist() {
  const [symbols, setSymbols] = useState<WishlistSymbol[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setSymbols([]);
      } else {
        const parsed = JSON.parse(raw) as WishlistSymbol[];
        setSymbols(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (next: WishlistSymbol[]) => {
    setSymbols(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore transient write errors
    }
  }, []);

  const add = useCallback(
    async (symbol: WishlistSymbol) => {
      const current = symbols || [];
      if (current.includes(symbol)) return;
      await save([...current, symbol]);
    },
    [symbols, save]
  );

  const remove = useCallback(
    async (symbol: WishlistSymbol) => {
      const current = symbols || [];
      if (!current.includes(symbol)) return;
      await save(current.filter((s) => s !== symbol));
    },
    [symbols, save]
  );

  const toggle = useCallback(
    async (symbol: WishlistSymbol) => {
      const current = symbols || [];
      if (current.includes(symbol)) {
        await remove(symbol);
      } else {
        await add(symbol);
      }
    },
    [symbols, add, remove]
  );

  const isInWishlist = useMemo(() => {
    const set = new Set(symbols || []);
    return (symbol: WishlistSymbol) => set.has(symbol);
  }, [symbols]);

  return { symbols: symbols || [], loading, error, reload: load, add, remove, toggle, isInWishlist };
}


