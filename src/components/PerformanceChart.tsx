import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface TradeRecord {
  id: string;
  timestamp: number;
  pair: string;
  profit: number;
  success: boolean;
}

interface PerformanceChartProps {
  trades: TradeRecord[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ trades }) => {
  // Generate sample data if no trades exist
  const sampleTrades = trades.length === 0 ? [
    { id: '1', timestamp: Date.now() - 300000, pair: 'SOL/USDC', profit: 0.12, success: true },
    { id: '2', timestamp: Date.now() - 240000, pair: 'RAY/SOL', profit: -0.05, success: false },
    { id: '3', timestamp: Date.now() - 180000, pair: 'ORCA/USDT', profit: 0.08, success: true },
    { id: '4', timestamp: Date.now() - 120000, pair: 'SOL/RAY', profit: -0.07, success: false },
    { id: '5', timestamp: Date.now() - 60000, pair: 'USDC/USDT', profit: 0.15, success: true },
  ] : trades;

  const chartData = sampleTrades.map((trade, index) => ({
    time: new Date(trade.timestamp).toLocaleTimeString(),
    profit: trade.profit,
    cumulative: sampleTrades.slice(0, index + 1).reduce((sum, t) => sum + t.profit, 0),
    pair: trade.pair
  }));

  const totalProfit = sampleTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const successRate = (sampleTrades.filter(t => t.success).length / sampleTrades.length) * 100;
  const totalTrades = sampleTrades.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total P&L</p>
                <p className={`text-lg font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${totalProfit.toFixed(3)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total Trades</p>
                <p className="text-lg font-bold">{totalTrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-lg font-bold">{successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Avg Trade</p>
                <p className={`text-lg font-bold ${(totalProfit/totalTrades) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${(totalProfit/totalTrades).toFixed(3)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cumulative P&L Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative P&L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(3)}`, 'Cumulative P&L']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Trade Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(3)}`, 'Profit/Loss']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Bar 
                  dataKey="profit" 
                  fill={(entry: any) => entry.profit >= 0 ? '#10b981' : '#ef4444'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};