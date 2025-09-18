import { ScrollView, Text, View } from 'react-native';
import type { SymbolStats } from '../../types/market';
import { styles } from '../styles/homeStyles';

export function HeatmapView({ symbols, numCols }: { symbols: SymbolStats[]; numCols: number }) {
  const sorted = symbols.slice().sort((a, b) => Math.abs(b.net_change) - Math.abs(a.net_change));
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
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
    </ScrollView>
  );
}

export default HeatmapView;
