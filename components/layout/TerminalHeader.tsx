import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { MenuKey, Ticker } from '../../types/market';
import { styles } from '../styles/homeStyles';

export function TerminalHeader({ tickers, selectedMenu, onSelectMenu }: { tickers: Ticker[]; selectedMenu: MenuKey; onSelectMenu: (key: MenuKey) => void }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (!containerWidth || !contentWidth || tickers.length === 0) return;
    const speedPxPerSec = 60;
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

export default TerminalHeader;
