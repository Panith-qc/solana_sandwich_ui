import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, WifiOff, Wifi } from 'lucide-react';

interface WalletConnectionProps {
  onWalletConnected: (address: string) => void;
  onWalletDisconnected: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  onWalletConnected,
  onWalletDisconnected
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if ('solana' in window) {
        const wallet = (window as any).solana;
        if (wallet.isPhantom && wallet.isConnected) {
          const response = await wallet.connect({ onlyIfTrusted: true });
          if (response.publicKey) {
            const address = response.publicKey.toString();
            setWalletAddress(address);
            setIsConnected(true);
            onWalletConnected(address);
            
            // Simulate balance fetch
            setBalance(1.2345 + Math.random() * 0.5);
          }
        }
      }
    } catch (error) {
      console.log('No wallet auto-connection');
    }
  };

  const connectWallet = async () => {
    if (!('solana' in window)) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      const wallet = (window as any).solana;
      
      if (wallet.isPhantom) {
        const response = await wallet.connect();
        const address = response.publicKey.toString();
        
        setWalletAddress(address);
        setIsConnected(true);
        setBalance(1.2345 + Math.random() * 0.5);
        onWalletConnected(address);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if ('solana' in window) {
        const wallet = (window as any).solana;
        await wallet.disconnect();
      }
      
      setIsConnected(false);
      setWalletAddress('');
      setBalance(0);
      onWalletDisconnected();
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Phantom Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your Phantom wallet to enable live trading mode
            </p>
            <Button 
              onClick={connectWallet} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect Phantom Wallet'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Don't have Phantom? Click above to install
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Phantom Wallet
          </div>
          <Badge variant="default" className="bg-green-500">
            <Wifi className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-mono text-sm">
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="font-bold">{balance.toFixed(4)} SOL</p>
          </div>
          <Button 
            onClick={disconnectWallet} 
            variant="outline" 
            className="w-full"
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};