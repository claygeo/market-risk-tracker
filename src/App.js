import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, TrendingDown, Zap, Skull, AlertTriangle, Loader } from 'lucide-react';

// Constants
const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';
const MIN_LEVERAGE = 10;
const MIN_LOSS_PERCENTAGE = 50;
const MIN_POSITION_VALUE = 1000;

// Popular trading pairs for discovery
const ACTIVE_COINS = ['BTC', 'ETH', 'SOL', 'ARB', 'AVAX', 'OP', 'MATIC', 'DOGE', 'SUI', 'APT'];

// Known active addresses (you can add more as you discover them)
const SEED_ADDRESSES = [
  '0xf2a6526b6b5241b0e2fe06d7f76d471a282d9a4f', // Your address
  // Add more known addresses here as you discover them
];

// Utility Functions
const formatAddress = (address) => {
  if (!address) return '...????';
  return `...${address.slice(-4)}`;
};

const formatPnL = (value) => {
  if (!value && value !== 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const calculatePnLPercentage = (unrealizedPnl, positionValue) => {
  if (!positionValue || positionValue === 0) return 0;
  return (unrealizedPnl / positionValue) * 100;
};

const calculateLiquidationDistance = (liquidationPx, markPx, isLong) => {
  if (!liquidationPx || !markPx || markPx === 0) return 0;
  const distance = isLong 
    ? ((markPx - liquidationPx) / markPx) * 100
    : ((liquidationPx - markPx) / markPx) * 100;
  return Math.max(0, Math.min(100, distance));
};

const calculateTimeInPosition = (entryTime) => {
  if (!entryTime) return 'Unknown';
  const now = Date.now();
  const timeDiff = now - entryTime;
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
};

// Generate mock addresses for demonstration
const generateMockAddresses = () => {
  const mockAddresses = [];
  for (let i = 0; i < 20; i++) {
    const randomHex = Math.random().toString(16).substring(2, 10);
    mockAddresses.push(`0x${randomHex}${randomHex}${randomHex}${randomHex}${randomHex}`);
  }
  return mockAddresses;
};

// SpinButton Component
const SpinButton = ({ onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative w-full h-24 rounded-2xl font-bold text-xl
        transform transition-all duration-200
        ${isLoading 
          ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed' 
          : disabled
          ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-75'
          : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 active:scale-95'
        }
        text-white shadow-2xl
        ${!isLoading && !disabled && 'hover:shadow-red-500/25'}
      `}
      aria-label={isLoading ? 'Finding disaster positions' : 'Spin for pain'}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3">
          <Loader className="w-6 h-6 animate-spin" />
          <span className="animate-pulse">Finding Disaster...</span>
        </div>
      ) : disabled ? (
        <div className="flex items-center justify-center gap-3">
          <AlertTriangle className="w-6 h-6" />
          <span>No Disasters Found</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <Skull className="w-6 h-6" />
          <span>SPIN FOR PAIN</span>
          <Skull className="w-6 h-6" />
        </div>
      )}
    </button>
  );
};

// PositionCard Component
const PositionCard = ({ position }) => {
  if (!position) return null;

  const getLossColor = (pnlPercentage) => {
    const absLoss = Math.abs(pnlPercentage);
    if (absLoss >= 90) return 'from-red-900 to-red-950';
    if (absLoss >= 70) return 'from-red-800 to-red-900';
    if (absLoss >= 50) return 'from-red-700 to-red-800';
    if (absLoss >= 30) return 'from-red-600 to-red-700';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className={`
      relative overflow-hidden rounded-3xl p-6
      bg-gradient-to-br ${getLossColor(position.pnlPercentage)}
      shadow-2xl border border-red-500/20
      transform transition-all duration-500 animate-fadeIn
    `}>
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-red-200 text-sm font-medium">DEGEN</p>
            <p className="text-white text-xl font-mono">{formatAddress(position.user)}</p>
          </div>
          <div className="text-right">
            <p className="text-red-200 text-sm font-medium">ASSET</p>
            <p className="text-white text-xl font-bold">{position.coin}</p>
          </div>
        </div>

        {/* PnL Display */}
        <div className="text-center py-4">
          <p className="text-red-200 text-sm font-medium mb-1">UNREALIZED P&L</p>
          <p className="text-white text-5xl font-bold mb-1">{formatPnL(position.unrealizedPnl)}</p>
          <p className="text-red-300 text-2xl font-semibold">
            {position.pnlPercentage.toFixed(1)}%
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <p className="text-red-200 text-xs font-medium">LEVERAGE</p>
            </div>
            <p className="text-white text-2xl font-bold">{position.leverage}x</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <p className="text-red-200 text-xs font-medium">POSITION SIZE</p>
            </div>
            <p className="text-white text-2xl font-bold">{formatPnL(position.positionValue)}</p>
          </div>
        </div>

        {/* Liquidation Warning */}
        <div className="bg-black/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <p className="text-red-200 text-xs font-medium">LIQUIDATION DISTANCE</p>
          </div>
          <div className="relative h-3 bg-black/50 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, 100 - position.liquidationDistance)}%` }}
            ></div>
          </div>
          <p className="text-orange-300 text-sm font-medium mt-1">
            {position.liquidationDistance.toFixed(1)}% away
          </p>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-red-200 text-xs font-medium">ENTRY PRICE</p>
            <p className="text-white text-lg font-semibold">{position.entryPrice}</p>
          </div>
          <div>
            <p className="text-red-200 text-xs font-medium">MARK PRICE</p>
            <p className="text-white text-lg font-semibold">{position.markPrice}</p>
          </div>
        </div>

        {/* Time in Position */}
        <div className="text-center">
          <p className="text-red-200 text-xs font-medium">SUFFERING FOR</p>
          <p className="text-white text-lg font-semibold">{position.timeInPosition}</p>
        </div>
      </div>
    </div>
  );
};

// Mock disaster positions for demonstration
const MOCK_DISASTERS = [
  {
    user: '0x1234567890abcdef1234567890abcdef12347a3f',
    coin: 'ETH',
    unrealizedPnl: -125430,
    pnlPercentage: -87.5,
    leverage: 25,
    positionValue: 143348,
    liquidationDistance: 12.3,
    entryPrice: '3850.00',
    markPrice: '3125.50',
    timeInPosition: '3 days 14 hours'
  },
  {
    user: '0xabcdef1234567890abcdef1234567890abcd8b2e',
    coin: 'BTC',
    unrealizedPnl: -89234,
    pnlPercentage: -72.1,
    leverage: 20,
    positionValue: 123765,
    liquidationDistance: 8.7,
    entryPrice: '68500.00',
    markPrice: '45230.00',
    timeInPosition: '1 day 7 hours'
  },
  {
    user: '0x7890abcdef1234567890abcdef1234567890c4d1',
    coin: 'SOL',
    unrealizedPnl: -45678,
    pnlPercentage: -94.2,
    leverage: 50,
    positionValue: 48502,
    liquidationDistance: 3.2,
    entryPrice: '185.00',
    markPrice: '98.50',
    timeInPosition: '18 hours'
  },
  {
    user: '0xdef1234567890abcdef1234567890abcdef1f5a2',
    coin: 'AVAX',
    unrealizedPnl: -234567,
    pnlPercentage: -91.8,
    leverage: 30,
    positionValue: 255616,
    liquidationDistance: 5.4,
    entryPrice: '95.00',
    markPrice: '42.30',
    timeInPosition: '5 days 2 hours'
  },
  {
    user: '0x9876543210fedcba9876543210fedcba98765432',
    coin: 'ARB',
    unrealizedPnl: -67890,
    pnlPercentage: -78.3,
    leverage: 35,
    positionValue: 86678,
    liquidationDistance: 7.8,
    entryPrice: '2.85',
    markPrice: '1.42',
    timeInPosition: '2 days 19 hours'
  }
];

// Main App Component
export default function App() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPositions, setAllPositions] = useState([]);
  const [noPositionsFound, setNoPositionsFound] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Fetch positions for a single address
  const fetchUserPositions = async (userAddress) => {
    try {
      const response = await fetch(HYPERLIQUID_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'clearinghouseState',
          user: userAddress
        })
      });

      if (!response.ok) return null;
      const data = await response.json();
      
      if (!data.assetPositions || data.assetPositions.length === 0) return null;
      
      // Get current prices for position calculations
      const midsResponse = await fetch(HYPERLIQUID_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'allMids' })
      });
      
      const mids = await midsResponse.json();
      
      return data.assetPositions.map(assetPos => {
        const pos = assetPos.position;
        const markPrice = parseFloat(mids[pos.coin] || pos.entryPx || 0);
        const entryPrice = parseFloat(pos.entryPx || 0);
        const size = parseFloat(pos.szi || 0);
        const unrealizedPnl = parseFloat(pos.unrealizedPnl || 0);
        const positionValue = Math.abs(size * entryPrice);
        const isLong = size > 0;
        
        return {
          user: userAddress,
          coin: pos.coin,
          unrealizedPnl: unrealizedPnl,
          pnlPercentage: calculatePnLPercentage(unrealizedPnl, positionValue),
          leverage: parseFloat(pos.leverage?.value || 0),
          positionValue: positionValue,
          liquidationDistance: calculateLiquidationDistance(
            parseFloat(pos.liquidationPx || 0),
            markPrice,
            isLong
          ),
          entryPrice: entryPrice.toFixed(2),
          markPrice: markPrice.toFixed(2),
          entryTime: pos.openTime || Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          timeInPosition: calculateTimeInPosition(pos.openTime),
          size: size,
          isLong: isLong
        };
      }).filter(pos => 
        pos.leverage >= MIN_LEVERAGE &&
        pos.pnlPercentage <= -MIN_LOSS_PERCENTAGE &&
        pos.positionValue >= MIN_POSITION_VALUE
      );
    } catch (err) {
      console.error('Error fetching user positions:', err);
      return null;
    }
  };

  // Main function to find disaster positions
  const findDisasterPositions = async () => {
    setIsLoading(true);
    setError(null);
    setNoPositionsFound(false);
    
    try {
      // First try with known addresses
      const addressesToCheck = [...SEED_ADDRESSES];
      const disasterPositions = [];
      
      // Check known addresses first
      for (const address of addressesToCheck) {
        const positions = await fetchUserPositions(address);
        if (positions && positions.length > 0) {
          disasterPositions.push(...positions);
        }
      }
      
      // If no real disasters found, use mock data
      if (disasterPositions.length === 0) {
        console.log('No real disasters found, using mock data for demonstration');
        setUseMockData(true);
        
        // Randomly select from mock disasters
        const randomIndex = Math.floor(Math.random() * MOCK_DISASTERS.length);
        setCurrentPosition(MOCK_DISASTERS[randomIndex]);
        setAllPositions(MOCK_DISASTERS);
        return;
      }

      // Sort by pain level
      disasterPositions.sort((a, b) => {
        const aPain = Math.abs(a.pnlPercentage) * 0.7 + (100 - a.liquidationDistance) * 0.3;
        const bPain = Math.abs(b.pnlPercentage) * 0.7 + (100 - b.liquidationDistance) * 0.3;
        return bPain - aPain;
      });
      
      setAllPositions(disasterPositions);
      
      // Select a random position from the disasters
      const randomIndex = Math.floor(Math.random() * disasterPositions.length);
      setCurrentPosition(disasterPositions[randomIndex]);
      setUseMockData(false);
      
    } catch (err) {
      setError('Failed to fetch positions. Using demonstration data.');
      console.error('API Error:', err);
      
      // Fallback to mock data on error
      const randomIndex = Math.floor(Math.random() * MOCK_DISASTERS.length);
      setCurrentPosition(MOCK_DISASTERS[randomIndex]);
      setAllPositions(MOCK_DISASTERS);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hyper Rekt
          </h1>
          <p className="text-gray-400 text-lg">
            Witness Hyperliquid's Most Painful Positions
          </p>
          {useMockData && (
            <p className="text-yellow-500 text-sm mt-2">
              Demo Mode - Add more addresses for real data
            </p>
          )}
        </div>

        {/* Spin Button */}
        <div className="mb-8">
          <SpinButton 
            onClick={findDisasterPositions} 
            isLoading={isLoading}
            disabled={noPositionsFound}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Position Card */}
        {currentPosition && !isLoading && (
          <PositionCard position={currentPosition} />
        )}

        {/* Initial State */}
        {!currentPosition && !isLoading && !error && !noPositionsFound && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-800/50 mb-4">
              <Skull className="w-12 h-12 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg">
              Press the button to reveal a trading disaster
            </p>
          </div>
        )}

        {/* Stats */}
        {allPositions.length > 0 && !isLoading && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {useMockData ? 'Showing demo disasters' : `Found ${allPositions.length} disaster position${allPositions.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Live positions with leverage &gt;{MIN_LEVERAGE}x and losses &gt;{MIN_LOSS_PERCENTAGE}%
          </p>
          <p className="text-gray-700 text-xs mt-1">
            Not financial advice. Just entertainment.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}