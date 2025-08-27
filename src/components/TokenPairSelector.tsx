import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Settings, TrendingUp, Coins } from 'lucide-react';

interface TokenPair {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  enabled: boolean;
}

interface TokenPairSelectorProps {
  onPairsChanged: (enabledPairs: string[]) => void;
}

export const TokenPairSelector: React.FC<TokenPairSelectorProps> = ({ onPairsChanged }) => {
  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([
    { id: 'SOL', symbol: 'SOL', name: 'Solana', price: 182.65, change24h: -4.83, volume24h: 2.8e9, enabled: true },
    { id: 'USDC', symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.01, volume24h: 8.2e9, enabled: true },
    { id: 'USDT', symbol: 'USDT', name: 'Tether', price: 1.001, change24h: -0.02, volume24h: 45.1e9, enabled: true },
    { id: 'RAY', symbol: 'RAY', name: 'Raydium', price: 3.38, change24h: -6.94, volume24h: 125e6, enabled: true },
    { id: 'ORCA', symbol: 'ORCA', name: 'Orca', price: 2.29, change24h: -5.37, volume24h: 45e6, enabled: true },
    { id: 'BONK', symbol: 'BONK', name: 'Bonk', price: 0.000034, change24h: -8.21, volume24h: 89e6, enabled: false },
    { id: 'JUP', symbol: 'JUP', name: 'Jupiter', price: 0.87, change24h: -3.45, volume24h: 234e6, enabled: false },
    { id: 'WIF', symbol: 'WIF', name: 'Dogwifhat', price: 2.14, change24h: -7.89, volume24h: 156e6, enabled: false },
  ]);

  const handleTogglePair = (pairId: string) => {
    const updatedPairs = tokenPairs.map(pair => 
      pair.id === pairId ? { ...pair, enabled: !pair.enabled } : pair
    );
    setTokenPairs(updatedPairs);
    
    const enabledPairIds = updatedPairs.filter(pair => pair.enabled).map(pair => pair.id);
    onPairsChanged(enabledPairIds);
  };

  const handleSelectAll = () => {
    const allEnabled = tokenPairs.map(pair => ({ ...pair, enabled: true }));
    setTokenPairs(allEnabled);
    onPairsChanged(allEnabled.map(pair => pair.id));
  };

  const handleSelectNone = () => {
    const noneEnabled = tokenPairs.map(pair => ({ ...pair, enabled: false }));
    setTokenPairs(noneEnabled);
    onPairsChanged([]);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(0)}M`;
    return `$${volume.toFixed(0)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toExponential(2);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(2);
  };

  const enabledCount = tokenPairs.filter(pair => pair.enabled).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Trading Pairs
          </div>
          <Badge variant="secondary">
            {enabledCount} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleSelectNone}>
              Select None
            </Button>
          </div>

          {/* Token List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tokenPairs.map((pair) => (
              <div
                key={pair.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  pair.enabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={pair.enabled}
                    onCheckedChange={() => handleTogglePair(pair.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{pair.symbol}</span>
                      <span className="text-sm text-muted-foreground">{pair.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>${formatPrice(pair.price)}</span>
                      <span className={pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                      </span>
                      <span>Vol: {formatVolume(pair.volume24h)}</span>
                    </div>
                  </div>
                </div>
                
                {pair.enabled && (
                  <Badge variant="default" className="bg-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Select tokens to monitor for arbitrage opportunities. More pairs = more opportunities but higher resource usage.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};