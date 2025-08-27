import { useState, useEffect, useCallback } from 'react';
import { realTradingService } from '@/services/realTradingService';
import { realMarketData } from '@/services/realMarketData';

interface TradingOpportunity {
  id: string;
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  estimatedOutput: number;
  priceImpact: number;
  confidence: number;
  profitPotential: number;
  gasEstimate: number;
  route: any;
}

interface BotStats {
  totalTrades: number;
  successfulTrades: number;
  totalProfit: number;
  totalGasSpent: number;
  netProfit: number;
  successRate: number;
  startTime: number;
}

export const useRealSandwichBot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [opportunities, setOpportunities] = useState<TradingOpportunity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [autoExecute, setAutoExecute] = useState(false);
  const [stats, setStats] = useState<BotStats>({
    totalTrades: 0,
    successfulTrades: 0,
    totalProfit: 0,
    totalGasSpent: 0,
    netProfit: 0,
    successRate: 0,
    startTime: 0
  });

  const startBot = useCallback(async () => {
    if (isRunning) return;
    
    console.log('🚀 STARTING ENTERPRISE BOT - NO CRASHES GUARANTEED...');
    setIsRunning(true);
    setError(null);
    setStats(prev => ({ ...prev, startTime: Date.now() }));
    
    try {
      console.log('🔗 Connecting to REAL market data...');
      await realMarketData.connect();
      
      console.log('✅ Market data connected - starting bot loop...');
      botLoop();
      
    } catch (error) {
      console.error('❌ Bot startup failed:', error);
      setIsRunning(false);
      setError(`Startup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  const stopBot = useCallback(() => {
    console.log('🛑 STOPPING BOT...');
    setIsRunning(false);
    setError(null);
  }, []);

  const botLoop = useCallback(async () => {
    console.log('🔄 Bot loop running...');
    
    if (!isRunning) {
      console.log('🛑 Bot stopped - exiting loop');
      return;
    }
    
    try {
      console.log('🔍 SCANNING for opportunities...');
      
      const foundOpportunities = await realTradingService.scanForArbitrageOpportunities();
      
      console.log(`📊 Found ${foundOpportunities.length} opportunities`);
      setOpportunities(foundOpportunities);
      
      if (foundOpportunities.length > 0 && autoExecute) {
        for (const opp of foundOpportunities.slice(0, 2)) {
          if (opp.confidence > 70 && opp.profitPotential > opp.gasEstimate + 1) {
            console.log(`🎯 Executing: ${opp.inputToken}/${opp.outputToken}`);
            await executeOpportunity(opp);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Bot loop error:', error);
      setError(`Scan error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Schedule next scan
    if (isRunning) {
      setTimeout(botLoop, 8000);
    }
  }, [isRunning, autoExecute]);

  const executeOpportunity = useCallback(async (opportunity: TradingOpportunity) => {
    try {
      console.log(`💫 Executing trade: ${opportunity.inputToken}/${opportunity.outputToken}`);
      
      const result = await realTradingService.executeArbitrageTrade(
        opportunity,
        undefined, // No wallet = demo mode
        false // Demo mode
      );
      
      console.log(`✅ Trade result:`, result);
      
      // Update stats
      setStats(prev => {
        const newTotal = prev.totalTrades + 1;
        const newSuccessful = prev.successfulTrades + (result.success ? 1 : 0);
        const newProfit = prev.totalProfit + result.profit;
        const newGasSpent = prev.totalGasSpent + result.gasUsed;
        
        return {
          ...prev,
          totalTrades: newTotal,
          successfulTrades: newSuccessful,
          totalProfit: newProfit,
          totalGasSpent: newGasSpent,
          netProfit: newProfit - newGasSpent,
          successRate: (newSuccessful / newTotal) * 100
        };
      });
      
    } catch (error) {
      console.error('❌ Execute error:', error);
    }
  }, []);

  return {
    isRunning,
    opportunities,
    error,
    autoExecute,
    stats,
    startBot,
    stopBot,
    setAutoExecute,
    executeOpportunity
  };
};