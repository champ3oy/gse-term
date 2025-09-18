import { useWishlist } from '@/hooks/use-wishlist';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

type SymbolStats = {
  symbol: string;
  bid_volume: string;
  bid_price: string;
  ask_volume: string;
  ask_price: string;
  last_trade_price: string;
  last_trade_volume: string;
  total_trade_volume: string;
  total_trade_value: string;
  open_price: string;
  high_price: string;
  low_price: string;
  close_price: string;
  net_change: number;
  change_icon: string;
  percent_change: number;
  percent_change_icon: string;
};

const GSE_API_URL = 'https://gsemarketwatch.com/api/symbol-statistics';

type Ticker = { symbol: string; last: string; changePct: number };

type MenuKey = 'Terminal' | 'Heatmap' | 'Movers' | 'Watchlist';

function TerminalHeader({ tickers, selectedMenu, onSelectMenu }: { tickers: Ticker[]; selectedMenu: MenuKey; onSelectMenu: (key: MenuKey) => void }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (!containerWidth || !contentWidth || tickers.length === 0) return;

    const speedPxPerSec = 60; // marquee speed
    const distance = contentWidth + containerWidth;
    const duration = Math.max(1000, (distance / speedPxPerSec) * 1000);

    translateX.setValue(0);
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -contentWidth,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      { resetBeforeIteration: true }
    );
    anim.start();
    return () => anim.stop();
  }, [containerWidth, contentWidth, tickers.length, translateX]);

  const renderTickerItems = () => (
    <View style={{ flexDirection: 'row' }}>
      {tickers.map((t, i) => (
        <View key={`${t.symbol}-${i}`} style={styles.tickerItem}>
          <Text style={styles.tickerSymbol} numberOfLines={1}>{t.symbol}</Text>
          <Text style={styles.tickerLast}>{parseFloat(t.last).toFixed(2)}</Text>
          <Text style={[styles.tickerChg, { color: t.changePct > 0 ? '#00ff41' : t.changePct < 0 ? '#ff0033' : '#9aa0a6' }]}>
            {Number.isFinite(t.changePct) ? `${t.changePct.toFixed(2)}` : '0.00'}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View>
      <View style={styles.terminalHeader}>
        <Text style={styles.terminalHeaderTitle}>GSE TERM</Text>
        <Text style={styles.terminalHeaderClock}>{new Date().toLocaleTimeString()}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuBar}>
        {(['Terminal', 'Heatmap', 'Movers', 'Watchlist'] as MenuKey[]).map((label) => (
          <TouchableOpacity key={label} style={[styles.menuItem, selectedMenu === label && styles.menuItemActive]} onPress={() => onSelectMenu(label)}>
            <Text style={[styles.menuItemText, selectedMenu === label && styles.menuItemTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.ticker} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}> 
        {tickers.length === 0 ? (
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.tickerItem}><Text style={styles.tickerSymbol}>—</Text><Text style={styles.tickerLast}>—</Text><Text style={styles.tickerChg}>—</Text></View>
          </View>
        ) : (
          <Animated.View
            style={{ flexDirection: 'row', transform: [{ translateX }] }}
            onLayout={(e) => setContentWidth(e.nativeEvent.layout.width / 2)}
          >
            {renderTickerItems()}
            {renderTickerItems()}
            {renderTickerItems()}
            {renderTickerItems()}
          </Animated.View>
        )}
      </View>
    </View>
  );
}

function StockRow({ item }: { item: SymbolStats }) {
  const router = useRouter();
  const last = parseFloat(item.last_trade_price || item.open_price || '0');
  const changePct = item.percent_change;
  const change = item.net_change;
  const isUp = change > 0;
  const isDown = change < 0;
  const changeColor = isUp ? '#00ff41' : isDown ? '#ff0033' : '#9aa0a6';
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: '/(tabs)/stock/[symbol]',
          params: {
            symbol: item.symbol,
            last: String(last || ''),
            net_change: String(Number.isFinite(change) ? change : ''),
            percent_change: String(Number.isFinite(changePct) ? changePct : ''),
            bid_price: item.bid_price || '',
            ask_price: item.ask_price || '',
            open_price: item.open_price || '',
            high_price: item.high_price || '',
            low_price: item.low_price || '',
            close_price: item.close_price || '',
            total_trade_volume: item.total_trade_volume || '',
            total_trade_value: item.total_trade_value || '',
          },
        });
      }}
      style={styles.row}
    >
      <View style={[styles.cell, { flex: 1.3 }]}>
        <Text style={styles.symbol} numberOfLines={1} ellipsizeMode="tail">{item.symbol}</Text>
      </View>
      <View style={[styles.cell, { flex: 0.9, backgroundColor: isUp ? '#00ff41' : isDown ? '#ff0033' : '#000' }]}>
        <Text style={[styles.last, { color: isUp ? '#000' : isDown ? '#fff' : '#9aa0a6' }]}>{Number.isFinite(last) ? last.toFixed(2) : '—'}</Text>
      </View>
      <View style={[styles.cell, { flex: 0.9 }]}>
        <Text style={[styles.changePct, { color: changeColor }]}>{Number.isFinite(change) ? change.toFixed(2) : '0.00'}</Text>
      </View>
      <View style={[styles.cell, { flex: 0.9 }]}>
        <Text style={[styles.changePct, { color: changeColor }]}>{Number.isFinite(changePct) ? changePct.toFixed(2) : '0.00'}%</Text>
      </View>
      <View style={[styles.cell, { flex: 0.9 }]}>
        <Text style={styles.bid}>{item.bid_price || '—'}</Text>
      </View>
      <View style={[styles.cell, { flex: 0.9 }]}>
        <Text style={styles.ask}>{item.ask_price || '—'}</Text>
      </View>
      <View style={[styles.cell, { flex: 1.1 }]}>
        <Text style={styles.vol}>
          {item.total_trade_volume
            ? (() => {
                const v = Number(item.total_trade_volume);
                if (!Number.isFinite(v)) return item.total_trade_volume;
                if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
                if (v >= 1_000_000) return (v / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
                if (v >= 100_000) return (v / 1_000).toFixed(0) + 'K';
                return v.toLocaleString();
              })()
            : '—'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function HeatmapView({ symbols, numCols }: { symbols: SymbolStats[]; numCols: number }) {
  // naive square sizing grid
  const sorted = symbols.slice().sort((a, b) => Math.abs(b.net_change) - Math.abs(a.net_change));
  return (
    <View style={styles.heatGrid}>
      {sorted.map((s) => {
        const pct = s.net_change;
        const pctPct = s.percent_change;
        const isUp = pct > 0;
        const bg = isUp ? `rgba(0,255,65,${Math.min(0.85, 0.2 + Math.abs(pct) / 5)})` : pct < 0 ? `rgba(255,0,51,${Math.min(0.85, 0.2 + Math.abs(pct) / 5)})` : 'rgba(154,160,166,0.25)';
        return (
          <View key={s.symbol} style={[styles.heatCell, { width: `${100 / numCols}%`, backgroundColor: bg }]}> 
            <Text style={styles.heatSymbol} numberOfLines={1}>{s.symbol}</Text>
            <View style={{ flexDirection: 'column' }}>
            <Text style={styles.heatPct} numberOfLines={1}>{Number.isFinite(pct) ? `${pct.toFixed(2)}` : '0.00%'}</Text>
            <Text style={styles.heatPct} numberOfLines={1}>{Number.isFinite(pctPct) ? `${pctPct.toFixed(2)}%` : '0.00%'}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1200;
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
      <View style={styles.centeredContentWrapper}>
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
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data || []}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => <StockRow item={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
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
            contentContainerStyle={{ paddingBottom: 80 }}
            ListHeaderComponent={() => (
              <View style={styles.gridHeader}>
                <Text style={[styles.gridHeaderText, { flex: 1.3, textAlign: 'left' }]}>SYMBOL</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>LAST</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>CHG</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>CHG%</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>BID</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>ASK</Text>
                <Text style={[styles.gridHeaderText, { flex: 1.1, textAlign: 'right' }]}>VOL</Text>
              </View>
            )}
          />
        ) : selectedMenu === 'Movers' ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={(data || []).filter((s) => Number.isFinite(s.net_change) && Math.abs(s.net_change) > 0).sort((a, b) => Math.abs(b.net_change) - Math.abs(a.net_change))}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => <StockRow item={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListHeaderComponent={() => (
              <View style={styles.gridHeader}>
                <Text style={[styles.gridHeaderText, { flex: 1.3, textAlign: 'left' }]}>SYMBOL</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>LAST</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>CHG</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>CHG%</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>BID</Text>
                <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>ASK</Text>
                <Text style={[styles.gridHeaderText, { flex: 1.1, textAlign: 'right' }]}>VOL</Text>
              </View>
            )}
          />
        ) : selectedMenu === 'Watchlist' ? (
          <WatchlistView allSymbols={data || []} />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <HeatmapView symbols={data || []} numCols={heatmapCols} />
          </ScrollView>
        )
      )}
      </View>
    </SafeAreaView>
  );
}

function WatchlistView({ allSymbols }: { allSymbols: SymbolStats[] }) {
  const { symbols: wishlistSymbols, loading } = useWishlist();
  const filtered = useMemo(() => {
    if (!wishlistSymbols || wishlistSymbols.length === 0) return [] as SymbolStats[];
    const set = new Set(wishlistSymbols);
    return allSymbols.filter((s) => set.has(s.symbol));
  }, [allSymbols, wishlistSymbols]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e2e8f0" />
        <Text style={{ marginTop: 8, color: '#94a3b8' }}>Loading watchlist…</Text>
      </View>
    );
  }

  if (filtered.length === 0) {
    return (
      <View style={[styles.center, { paddingHorizontal: 24 }]}> 
        <Text style={{ color: '#94a3b8', textAlign: 'center' }}>Your watchlist is empty. Add symbols from the details screen.</Text>
      </View>
    );
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={filtered}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => <StockRow item={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{ paddingBottom: 80 }}
      ListHeaderComponent={() => (
        <View style={styles.gridHeader}>
          <Text style={[styles.gridHeaderText, { flex: 1.3, textAlign: 'left' }]}>SYMBOL</Text>
          <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>LAST</Text>
          <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>CHG</Text>
          <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>CHG%</Text>
          <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>BID</Text>
          <Text style={[styles.gridHeaderText, { flex: 0.9, textAlign: 'right' }]}>ASK</Text>
          <Text style={[styles.gridHeaderText, { flex: 1.1, textAlign: 'right' }]}>VOL</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  centeredContentWrapper: { alignSelf: 'stretch' },
  terminalHeader: {
    paddingVertical: 6,
    backgroundColor: '#000000',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  terminalHeaderTitle: {
    color: '#ffffff',
    fontFamily: 'Brett',
    fontSize: 18,
    letterSpacing: 1,
    paddingHorizontal: 12,
  },
  terminalHeaderClock: {
    color: '#9aa0a6',
    fontSize: 17,
    fontFamily: "Brett"
  },
  menuBar: {
    backgroundColor: '#ff7f00',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  menuItem: { paddingHorizontal: 12, paddingVertical: 6 },
  menuItemActive: { backgroundColor: '#000' },
  menuItemText: { color: '#0a0a0a', fontWeight: '700' },
  menuItemTextActive: { color: '#ff7f00' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gridHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
    backgroundColor: '#0b0b0b',
  },
  gridHeaderText: {
    color: '#b3b3b3',
    fontSize: 12,
    letterSpacing: 1,
  },
  row: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    paddingRight: 6,
    paddingVertical: 5,
  },
  symbol: {
    color: '#ffbf00',
    fontSize: 15,
    fontFamily: 'Brett',
  },
  last: {
    color: '#e6e6e6',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    fontSize: 14,
  },
  changePct: {
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    fontSize: 14,
  },
  bid: {
    color: '#6aa7ff',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    fontSize: 14,
  },
  ask: {
    color: '#ffbf00',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    fontSize: 14,
  },
  vol: {
    color: '#9aa0a6',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    fontSize: 14,
  },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#333333' },
  ticker: {
    backgroundColor: '#000000',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tickerSymbol: { color: '#ffbf00', fontFamily: 'Brett', marginRight: 8 },
  tickerLast: { color: '#e6e6e6', marginRight: 8, fontVariant: ['tabular-nums'] },
  tickerChg: { fontVariant: ['tabular-nums'] },
  heatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: 8,
  },
  heatCell: {
    aspectRatio: 1.2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#444',
    padding: 8,
    justifyContent: 'space-between',
  },
  heatSymbol: {
    color: '#ffffff',
    fontFamily: 'Brett',
    fontSize: 16,
  },
  heatPct: {
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
});

// extra responsive container wrapper
styles.centeredContentWrapper = {
  alignSelf: 'stretch',
};
