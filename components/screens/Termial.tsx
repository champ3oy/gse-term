import { FlatList, Text, View } from 'react-native';
import type { SymbolStats } from '../../types/market';
import StockRow from '../layout/StockRow';
import { styles } from '../styles/homeStyles';

export function Terminal({ data, refreshControl }: { data: SymbolStats[], refreshControl: any}) {
  return (
    <FlatList
    showsVerticalScrollIndicator={false}
    data={data || []}
    keyExtractor={(item) => item.symbol}
    renderItem={({ item }) => <StockRow item={item} />}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    refreshControl={
        refreshControl
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
  );
}

export default Terminal;
