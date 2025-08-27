import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, TrendingUp, Zap, Activity, DollarSign, Target, Cpu } from 'lucide-react';

export default function Index() {
  const [isRunning, setIsRunning] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTrades: 0,
    successfulTrades: 0,
    totalProfit: 0,
    totalGasSpent: 0,
    netProfit: 0,
    successRate: 0
  });

  // Mock data for demonstration
  const realPrices = { SOL: 185.67, USDC: 1.0, USDT: 0.999, RAY: 4.89, ORCA: 3.45 };
  const positions = [];
  const mevMetrics = {
    mempoolSize: opportunities.length,
    networkCongestion: 'MEDIUM',
    lastScanTime: Date.now()
  };

  const startBot = async () => {
    setIsRunning(true);
    setError(null);
    console.log('🚀 Starting bot...');
    
    // Simulate finding opportunities and auto-executing them
    setTimeout(() => {
      const mockOpportunities = [
        {
          id: 'opp_1',
          inputToken: 'SOL',
          outputToken: 'USDC',
          confidence: 85,
          profitPotential: 2.45,
          inputAmount: 100,
          priceImpact: 0.5,
          gasEstimate: 0.25
        },
        {
          id: 'opp_2',
          inputToken: 'RAY',
          outputToken: 'SOL',
          confidence: 72,
          profitPotential: 1.89,
          inputAmount: 50,
          priceImpact: 0.3,
          gasEstimate: 0.18
        }
      ];
      setOpportunities(mockOpportunities);
      
      // Auto-execute high confidence opportunities after 3 seconds
      setTimeout(() => {
        executeOpportunities(mockOpportunities);
      }, 3000);
    }, 2000);
  };

  const executeOpportunities = (opportunities) => {
    opportunities.forEach((opp, index) => {
      if (opp.confidence >= 80) {
        setTimeout(() => {
          executeTrade(opp);
        }, index * 1000); // Execute with 1 second delay between trades
      }
    });
  };

  const executeTrade = (opportunity) => {
    console.log(`🎯 Executing trade: ${opportunity.inputToken}/${opportunity.outputToken}`);
    console.log(`💰 Expected profit: $${opportunity.profitPotential}`);
    
    // Simulate trade execution
    setTimeout(() => {
      const success = Math.random() > 0.25; // 75% success rate
      const actualProfit = success ? 
        opportunity.profitPotential * (0.8 + Math.random() * 0.4) : // 80-120% of expected
        -opportunity.gasEstimate; // Lose gas fees on failure
      
      // Update stats
      setStats(prev => {
        const newTotal = prev.totalTrades + 1;
        const newSuccessful = prev.successfulTrades + (success ? 1 : 0);
        const newTotalProfit = prev.totalProfit + actualProfit;
        const newGasSpent = prev.totalGasSpent + opportunity.gasEstimate;
        
        return {
          ...prev,
          totalTrades: newTotal,
          successfulTrades: newSuccessful,
          totalProfit: newTotalProfit,
          totalGasSpent: newGasSpent,
          netProfit: newTotalProfit - newGasSpent,
          successRate: (newSuccessful / newTotal) * 100
        };
      });
      
      console.log(`${success ? '✅' : '❌'} Trade ${success ? 'SUCCESS' : 'FAILED'}: ${opportunity.inputToken}/${opportunity.outputToken}`);
      console.log(`💰 Actual profit: $${actualProfit.toFixed(2)}`);
      
      // Remove executed opportunity from list
      setOpportunities(prev => prev.filter(op => op.id !== opportunity.id));
      
    }, 800 + Math.random() * 400); // Simulate network delay
  };

  const stopBot = () => {
    setIsRunning(false);
    setOpportunities([]);
    console.log('🛑 Bot stopped');
  };

  const formatUSD = (amount) => `$${amount.toFixed(2)}`;
  const formatSOL = (amount) => `${amount.toFixed(4)} SOL`;
  const formatPercent = (percent) => `${percent.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🥪 Solana Sandwich Bot
            </h1>
            <p className="text-gray-300">Advanced MEV Trading & Arbitrage</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={isRunning ? 'default' : 'secondary'} className="px-4 py-2">
              {isRunning ? '🟢 ACTIVE' : '🔴 INACTIVE'}
            </Badge>
            <Button
              onClick={isRunning ? stopBot : startBot}
              variant={isRunning ? 'destructive' : 'default'}
              size="lg"
            >
              {isRunning ? 'Stop Bot' : 'Start Bot'}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
            <div className="text-red-400 font-medium">❌ Error</div>
            <div className="text-sm text-gray-300">{error}</div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-black/40 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatUSD(stats.netProfit)}
              </div>
              <p className="text-xs text-gray-400">
                {formatSOL(stats.netProfit / 150)} • {formatPercent((stats.netProfit / 100) * 100)} ROI
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {formatPercent(stats.successRate)}
              </div>
              <p className="text-xs text-gray-400">
                {stats.successfulTrades}/{stats.totalTrades} successful
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Opportunities</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {opportunities.length}
              </div>
              <p className="text-xs text-gray-400">
                {opportunities.length} current
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Profit</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">
                {formatUSD(stats.totalTrades > 0 ? stats.totalProfit / stats.totalTrades : 0)}
              </div>
              <p className="text-xs text-gray-400">
                {formatSOL((stats.totalTrades > 0 ? stats.totalProfit / stats.totalTrades : 0) / 150)} per trade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="opportunities" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/40">
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="mempool">Mempool</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            <Card className="bg-black/40 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Live Sandwich Opportunities
                  {isRunning && (
                    <div className="ml-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">LIVE</span>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Real-time MEV opportunities detected from market analysis • {opportunities.length} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {opportunities.map((opp) => (
                      <div
                        key={opp.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {opp.inputToken}/{opp.outputToken}
                            </Badge>
                            <Badge 
                              variant={opp.confidence >= 80 ? 'default' : opp.confidence >= 60 ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {opp.confidence.toFixed(0)}% Confidence
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-300">
                            Estimated Profit: <span className="text-green-400 font-medium">
                              {formatUSD(opp.profitPotential)} ({formatPercent((opp.profitPotential / opp.inputAmount) * 100)})
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Price Impact: {formatPercent(opp.priceImpact)} • 
                            Gas: {formatUSD(opp.gasEstimate)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">
                            {formatUSD(opp.inputAmount)}
                          </div>
                          <div className="text-xs text-gray-400">
                            DETECTED
                          </div>
                        </div>
                      </div>
                    ))}
                    {opportunities.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>{isRunning ? 'Scanning for opportunities...' : 'No opportunities detected yet'}</p>
                        <p className="text-xs">Bot will scan for profitable sandwich trades</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="positions" className="space-y-4">
            <Card className="bg-black/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Active & Recent Positions
                </CardTitle>
                <CardDescription>
                  Track your sandwich trades and P&L in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No positions yet</p>
                  <p className="text-xs">Start the bot to begin sandwich trading</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mempool" className="space-y-4">
            <Card className="bg-black/40 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  Real-Time Price Monitor
                </CardTitle>
                <CardDescription>
                  Live Solana token prices from Jupiter API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-400 font-medium">{mevMetrics.mempoolSize}</div>
                    <div className="text-gray-400">Opportunities Scanned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-medium">{Object.keys(realPrices).length}</div>
                    <div className="text-gray-400">Tokens Monitored</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-medium">{mevMetrics.networkCongestion}</div>
                    <div className="text-gray-400">Network Status</div>
                  </div>
                </div>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {Object.entries(realPrices).map(([token, price]) => (
                      <div key={token} className="p-3 rounded border border-blue-500/20 bg-blue-500/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {token}
                            </Badge>
                            <span className="text-sm text-white font-medium">
                              {formatUSD(price)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Last Updated: {new Date(mevMetrics.lastScanTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-black/40 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-white">{formatPercent(stats.successRate)}</span>
                  </div>
                  <Progress value={stats.successRate} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-lg font-medium text-green-400">
                      {formatUSD(stats.totalProfit)}
                    </div>
                    <div className="text-xs text-gray-400">Total Profit</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-red-400">
                      {formatUSD(stats.totalGasSpent)}
                    </div>
                    <div className="text-xs text-gray-400">Gas Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card className="bg-black/40 border-gray-500/20">
              <CardHeader>
                <CardTitle className="text-white">Bot Configuration</CardTitle>
                <CardDescription>
                  Optimize your sandwich bot settings for maximum profitability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="capital" className="text-white">Capital ($)</Label>
                      <Input
                        id="capital"
                        type="number"
                        defaultValue={100}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="minProfit" className="text-white">Min Profit Threshold (SOL)</Label>
                      <Input
                        id="minProfit"
                        type="number"
                        step="0.001"
                        defaultValue={0.002}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="slippage" className="text-white">Slippage Tolerance (%)</Label>
                      <Input
                        id="slippage"
                        type="number"
                        step="0.1"
                        defaultValue={0.3}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="priorityFee" className="text-white">Priority Fee (microlamports)</Label>
                      <Input
                        id="priorityFee"
                        type="number"
                        defaultValue={1000}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-white font-medium">Bot Status</div>
                    <div className="text-sm text-gray-400">
                      {isRunning ? 'Actively scanning and trading' : 'Inactive'}
                    </div>
                  </div>
                  <Switch
                    checked={isRunning}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        startBot();
                      } else {
                        stopBot();
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}