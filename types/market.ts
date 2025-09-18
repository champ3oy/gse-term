export type SymbolStats = {
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

export type Ticker = { symbol: string; last: string; changePct: number };

export type MenuKey = 'Terminal' | 'Heatmap' | 'Movers' | 'Watchlist';
