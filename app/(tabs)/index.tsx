import TerminalHeader from '@/components/layout/TerminalHeader';
import Movers from '@/components/screens/Movers';
import Terminal from '@/components/screens/Termial';
import { GSE_API_URL } from '@/constants/api';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, Text, View, useWindowDimensions } from 'react-native';
import HeatmapView from '../../components/screens/Heatmap';
import WatchlistView from '../../components/screens/Watchlist';
import { styles } from '../../components/styles/homeStyles';
import type { MenuKey, SymbolStats, Ticker } from '../../types/market';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1200;
  const contentMaxWidth = isDesktop ? 1200 : isTablet ? 1000 : undefined;
  const heatmapCols = isDesktop ? 8 : isTablet ? 5 : 3;
  const [data, setData] = useState<SymbolStats[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useWishlist();

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(GSE_API_URL, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as SymbolStats[];
      setData(json);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('Terminal');

  const tickers: Ticker[] = (data || [])
    .filter((s) => Number.isFinite(s.net_change) && Math.abs(s.net_change) > 0)
    .slice(0, 50)
    .map((s) => ({ symbol: s.symbol, last: s.last_trade_price || s.open_price || '0', changePct: s.net_change }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.centeredContentWrapper, contentMaxWidth ? { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' } : null]}>
        <TerminalHeader tickers={tickers} selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#e2e8f0" />
            <Text style={{ marginTop: 8, color: '#94a3b8' }}>Loading symbols…</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={{ marginBottom: 8, color: '#ffba08' }}>Error: {error}</Text>
            <Text onPress={fetchData} style={{ color: '#38bdf8' }}>Tap to retry</Text>
          </View>
        ) : (
          selectedMenu === 'Terminal' ? (
            <Terminal
              data={data || []}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    fetchData();
                  }}
                  tintColor="#e2e8f0"
                />
              }
            />
          ) : selectedMenu === 'Movers' ? (
            <Movers data={(data || []).filter((s) => Number.isFinite(s.net_change) && Math.abs(s.net_change) > 0).sort((a, b) => Math.abs(b.net_change) - Math.abs(a.net_change))} />
          ) : selectedMenu === 'Watchlist' ? (
            <WatchlistView allSymbols={data || []} />
          ) : (
            <HeatmapView symbols={data || []} numCols={heatmapCols} />
          )
        )}
      </View>
    </SafeAreaView>
  );
}
