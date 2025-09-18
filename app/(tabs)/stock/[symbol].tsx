import { useWishlist } from '@/hooks/use-wishlist';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

function PriceLine({ points = 60 }: { points?: number }) {
  const data = useMemo(() => {
    const arr: number[] = [];
    let v = 50;
    for (let i = 0; i < points; i++) {
      v += (Math.random() - 0.5) * 6;
      v = Math.max(5, Math.min(95, v));
      arr.push(Number(v.toFixed(2)));
    }
    return arr;
  }, [points]);

  return (
    <View style={styles.chartBox}>
      <LineChart
        data={{
          labels: Array.from({ length: data.length }, (_, i) => (i % 10 === 0 ? String(i) : '')),
          datasets: [{ data, color: () => '#38bdf8', strokeWidth: 2 }],
          legend: undefined,
        }}
        width={Dimensions.get('window').width - 24}
        height={220}
        withInnerLines={true}
        withOuterLines={false}
        withDots={false}
        withShadow={false}
        chartConfig={{
          backgroundGradientFrom: '#0b0b0b',
          backgroundGradientTo: '#0b0b0b',
          decimalPlaces: 2,
          color: () => '#38bdf8',
          labelColor: () => '#666',
          propsForBackgroundLines: { stroke: '#222' },
          propsForLabels: { fontSize: 9 },
        }}
        bezier
        style={{ paddingRight: 0 }}
      />
    </View>
  );
}

export default function StockDetails() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1200;
  const contentMaxWidth = isDesktop ? 1100 : isTablet ? 900 : undefined;
  const router = useRouter();
  const params = useLocalSearchParams();
  const symbol = String(params.symbol || '—');
  const last = params.last ? Number(params.last) : undefined;
  const netChange = params.net_change ? Number(params.net_change) : undefined;
  const pctChange = params.percent_change ? Number(params.percent_change) : undefined;

  const isUp = (netChange || 0) > 0;
  const isDown = (netChange || 0) < 0;
  const chipBg = isUp ? '#00ff41' : isDown ? '#ff0033' : '#333';
  const chipFg = isUp ? '#000' : isDown ? '#fff' : '#ccc';

  const [range, setRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number } | null>(null);
  const { toggle, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(symbol);

  const series = useMemo(() => {
    const pointsByRange: Record<typeof range, number> = { '1D': 48, '1W': 7 * 8, '1M': 30, '3M': 90, '1Y': 365 } as any;
    const points = pointsByRange[range];
    const arr: number[] = [];
    let v = last && Number.isFinite(last) ? last : 50;
    for (let i = 0; i < points; i++) {
      const volatility = range === '1D' ? 0.6 : range === '1W' ? 0.9 : range === '1M' ? 1.2 : range === '3M' ? 1.6 : 2.0;
      v += (Math.random() - 0.5) * 2.5 * volatility;
      arr.push(Number(v.toFixed(2)));
    }
    return arr;
  }, [range, last]);

  const minVal = useMemo(() => Math.min(...series), [series]);
  const maxVal = useMemo(() => Math.max(...series), [series]);
  const lineColor = series[series.length - 1] >= series[0] ? '#00ff41' : '#ff0033';

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.contentWrap, contentMaxWidth ? { maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' } : null]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{symbol}</Text>
        <TouchableOpacity onPress={() => toggle(symbol)} style={[styles.watchBtn, inWishlist && styles.watchBtnActive]}>
          <Text style={[styles.watchBtnText, inWishlist && styles.watchBtnTextActive]}>{inWishlist ? 'Remove' : 'Watch'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.last}>{last !== undefined && Number.isFinite(last) ? last.toFixed(2) : '—'} <Text style={{fontSize: 16, color: "#94a3b8"}}>GHS</Text></Text>
        <View style={[styles.chip, { backgroundColor: chipBg }]}> 
          <Text style={[styles.chipText, { color: chipFg }]}>
            {Number.isFinite(netChange) ? netChange!.toFixed(2) : '0.00'} ({Number.isFinite(pctChange) ? pctChange!.toFixed(2) : '0.00'}%)
           
          </Text>
        </View>
      </View>

      <View style={styles.rangeTabs}>
        {(['1D','1W','1M','3M','1Y'] as const).map((r) => (
          <TouchableOpacity key={r} onPress={() => { setRange(r); setTooltip(null); }} style={[styles.rangeTab, range === r && styles.rangeTabActive]}>
            <Text style={[styles.rangeTabText, range === r && styles.rangeTabTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.chartBox, isTablet ? { height: 320 } : null]}>
        <LineChart
          data={{
            labels: Array.from({ length: series.length }, (_, i) => (i % Math.ceil(series.length / 6) === 0 ? String(i) : '')),
            datasets: [{ data: series, color: () => lineColor, strokeWidth: 2 }],
          }}
          width={(contentMaxWidth ? Math.min(width, contentMaxWidth) : width) - 24}
          height={isTablet ? 300 : 240}
          withInnerLines={true}
          withOuterLines={false}
          withDots={false}
          withShadow={true}
          yAxisInterval={1}
          onDataPointClick={(d) => setTooltip({ x: d.x, y: d.y, value: d.value })}
          formatYLabel={(v) => Number(v).toFixed(0)}
          chartConfig={{
            backgroundGradientFrom: '#0b0b0b',
            backgroundGradientTo: '#0b0b0b',
            decimalPlaces: 2,
            color: () => lineColor,
            labelColor: () => '#666',
            propsForBackgroundLines: { stroke: '#222' },
            fillShadowGradient: lineColor,
            fillShadowGradientOpacity: 0.15,
          }}
          bezier
          style={{ paddingRight: 0 }}
        />

        {tooltip && (
          <View style={[styles.tooltip, { left: Math.max(8, Math.min(tooltip.x - 28, (contentMaxWidth ? Math.min(width, contentMaxWidth) : width) - 80)), top: Math.max(8, tooltip.y - 30) }]}>
            <Text style={styles.tooltipText}>{tooltip.value.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.minMaxRow}>
          <Text style={styles.minMaxText}>Low {minVal.toFixed(2)}</Text>
          <Text style={styles.minMaxText}>High {maxVal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <Row label="Open" value={String(params.open_price || '—')} />
        <Row label="High" value={String(params.high_price || '—')} />
        <Row label="Low" value={String(params.low_price || '—')} />
        <Row label="Close" value={String(params.close_price || '—')} />
        <Row label="Bid" value={String(params.bid_price || '—')} />
        <Row label="Ask" value={String(params.ask_price || '—')} />
        <Row label="Volume" value={String(params.total_trade_volume || '—')} />
        <Row label="Value" value={String(params.total_trade_value || '—')} />
      </View>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}> 
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  contentWrap: { alignSelf: 'stretch' },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  back: { color: '#94a3b8' },
  title: { color: '#ffbf00', fontFamily: 'Brett', fontSize: 18 },
  watchBtn: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: '#444', borderRadius: 4, backgroundColor: '#0b0b0b' },
  watchBtnActive: { backgroundColor: '#ff7f00', borderColor: '#ff7f00' },
  watchBtnText: { color: '#94a3b8', fontSize: 12 },
  watchBtnTextActive: { color: '#000', fontWeight: '700' },
  summaryRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  last: { color: '#e6e6e6', fontSize: 32, fontVariant: ['tabular-nums'] },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  chipText: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  chartBox: {
    height: 250,
    marginHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
    backgroundColor: '#0b0b0b',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  rangeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  rangeTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
    borderRadius: 2,
    backgroundColor: '#0b0b0b',
  },
  rangeTabActive: { backgroundColor: '#ff7f00', borderColor: '#ff7f00' },
  rangeTabText: { color: '#9aa0a6', fontSize: 12 },
  rangeTabTextActive: { color: '#000', fontWeight: '700' },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#111',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tooltipText: { color: '#e6e6e6', fontSize: 12, fontVariant: ['tabular-nums'] },
  minMaxRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  minMaxText: { color: '#94a3b8', fontSize: 11 },
  grid: { paddingHorizontal: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222',
  },
  rowLabel: { color: '#94a3b8' },
  rowValue: { color: '#e6e6e6', fontVariant: ['tabular-nums'] },
});


