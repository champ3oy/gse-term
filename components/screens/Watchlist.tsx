import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useWishlist } from '../../hooks/use-wishlist';
import type { SymbolStats } from '../../types/market';
import StockRow from '../layout/StockRow';
import { styles } from '../styles/homeStyles';

export function WatchlistView({ allSymbols }: { allSymbols: SymbolStats[] }) {
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

export default WatchlistView;
