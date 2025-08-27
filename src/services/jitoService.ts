// Jito Bundle Service for Atomic Sandwich Execution
import { Connection, VersionedTransaction, PublicKey } from '@solana/web3.js';

interface JitoBundle {
  transactions: string[]; // base64 encoded transactions
  uuid?: string;
}

interface JitoBundleResponse {
  jsonrpc: string;
  result: string;
  id: number;
}

class JitoService {
  private jitoUrl = 'https://mainnet.block-engine.jito.wtf/api/v1/bundles';
  private tipAccount = new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'); // Jito tip account

  async submitBundle(
    transactions: VersionedTransaction[],
    tipLamports: number = 100000
  ): Promise<string | null> {
    try {
      console.log('🎯 Submitting Jito Bundle for atomic execution...');
      
      // Serialize transactions to base64
      const bundleTransactions = transactions.map(tx => 
        Buffer.from(tx.serialize()).toString('base64')
      );

      const bundle: JitoBundle = {
        transactions: bundleTransactions,
        uuid: `sandwich_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      };

      const response = await fetch(this.jitoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'sendBundle',
          params: [bundle]
        })
      });

      if (!response.ok) {
        throw new Error(`Jito bundle submission failed: ${response.status}`);
      }

      const result: JitoBundleResponse = await response.json();
      
      console.log('✅ Jito Bundle submitted successfully:', {
        bundleId: result.result,
        transactionCount: transactions.length,
        tipAmount: `${tipLamports} lamports`
      });

      return result.result;

    } catch (error) {
      console.error('❌ Jito Bundle submission failed:', error);
      return null;
    }
  }

  // Check bundle status
  async getBundleStatus(bundleId: string): Promise<any> {
    try {
      const response = await fetch(this.jitoUrl.replace('bundles', 'bundle_status'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBundleStatuses',
          params: [[bundleId]]
        })
      });

      const result = await response.json();
      return result.result?.[0] || null;
    } catch (error) {
      console.error('Failed to get bundle status:', error);
      return null;
    }
  }

  // Create tip instruction for bundle
  createTipInstruction(tipLamports: number, payer: PublicKey) {
    return {
      keys: [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: this.tipAccount, isSigner: false, isWritable: true }
      ],
      programId: new PublicKey('11111111111111111111111111111111'),
      data: Buffer.from([2, 0, 0, 0, ...new Uint8Array(new BigUint64Array([BigInt(tipLamports)]).buffer)])
    };
  }
}

export const jitoService = new JitoService();