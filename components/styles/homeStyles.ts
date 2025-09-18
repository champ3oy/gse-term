import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    fontFamily: 'Brett',
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

export const centeredContentWrapper = {
  alignSelf: 'stretch' as const,
};
