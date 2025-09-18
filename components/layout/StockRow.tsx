import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import type { SymbolStats } from '../../types/market';
import { styles } from '../styles/homeStyles';

export function StockRow({ item }: { item: SymbolStats }) {
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

export default StockRow;
