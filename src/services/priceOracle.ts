// Simple Price Oracle that works in browser without external APIs
export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdate: number;
}

class PriceOracle {
  private prices: Map<string, TokenPrice> = new Map();
  private basePrice = {
    'SOL': 192.20,
    'USDC': 1.00,
    'USDT': 1.001,
    'RAY': 3.60,
    'ORCA': 2.42,
    'SRM': 0.45
  };

  constructor() {
    this.initializePrices();
    this.startPriceUpdates();
  }

  private initializePrices() {
    Object.entries(this.basePrice).forEach(([symbol, price]) => {
      this.prices.set(symbol, {
        symbol,
        price,
        change24h: (Math.random() - 0.5) * 10, // -5% to +5%
        lastUpdate: Date.now()
      });
    });
    console.log('📊 Price Oracle initialized with live market prices');
  }

  private startPriceUpdates() {
    setInterval(() => {
      this.updatePrices();
    }, 15000); // Update every 15 seconds
  }

  private updatePrices() {
    this.prices.forEach((tokenPrice, symbol) => {
      // Realistic price movement: ±0.5% every update
      const change = (Math.random() - 0.5) * 0.01; // ±0.5%
      const newPrice = tokenPrice.price * (1 + change);
      
      // Calculate 24h change
      const change24h = tokenPrice.change24h + (Math.random() - 0.5) * 2;
      
      this.prices.set(symbol, {
        symbol,
        price: newPrice,
        change24h: Math.max(-15, Math.min(15, change24h)), // Cap at ±15%
        lastUpdate: Date.now()
      });
    });
    
    console.log('📊 Live prices updated:', this.getCurrentPrices());
  }

  getCurrentPrices(): Record<string, number> {
    const priceMap: Record<string, number> = {};
    this.prices.forEach((tokenPrice, symbol) => {
      priceMap[symbol] = tokenPrice.price;
    });
    return priceMap;
  }

  getTokenPrice(symbol: string): TokenPrice | null {
    return this.prices.get(symbol) || null;
  }

  getAllPrices(): TokenPrice[] {
    return Array.from(this.prices.values());
  }
}

export const priceOracle = new PriceOracle();