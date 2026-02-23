'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Zap, Check } from 'lucide-react';
import { RotationStrategy, StrategyRecommendation } from '@/types/outbound';
import { ActionButton } from '@/components/inbound/shared/ActionButton';

interface StrategyLogicProps {
  dispatchRefNumber: string;
  totalItems: number;
  onStrategySelect: (strategy: RotationStrategy) => void;
}

export function StrategyLogic({
  dispatchRefNumber,
  totalItems,
  onStrategySelect,
}: StrategyLogicProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<RotationStrategy | null>(null);

  // Mock strategy recommendations
  const recommendations: StrategyRecommendation[] = [
    {
      strategy: 'fifo',
      cost: 850,
      efficiency: 92,
      coverage: 100,
      description: 'First In, First Out - Oldest items picked first. Best for inventory management and reducing obsolescence.',
    },
    {
      strategy: 'fefo',
      cost: 920,
      efficiency: 88,
      coverage: 100,
      description: 'First Expire, First Out - Items with nearest expiry date picked first. Ideal for perishable goods.',
    },
    {
      strategy: 'lifo',
      cost: 780,
      efficiency: 85,
      coverage: 100,
      description: 'Last In, First Out - Newest items picked first. Fastest picking time with minimal travel.',
    },
  ];

  const handleSelectStrategy = () => {
    if (selectedStrategy) {
      onStrategySelect(selectedStrategy);
    }
  };

  const getStrategyIcon = (strategy: RotationStrategy) => {
    switch (strategy) {
      case 'fifo':
        return <TrendingDown className="w-5 h-5" />;
      case 'fefo':
        return <Zap className="w-5 h-5" />;
      case 'lifo':
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Inventory Rotation Strategy</h2>
        <p className="text-sm text-muted-foreground mt-1">
          DRN: <span className="font-semibold text-foreground">{dispatchRefNumber}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Select the optimal rotation strategy for {totalItems} items
        </p>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.strategy}
            onClick={() => setSelectedStrategy(rec.strategy)}
            className={`relative rounded-lg p-6 border-2 cursor-pointer transition-all ${
              selectedStrategy === rec.strategy
                ? 'border-accent bg-accent/5'
                : 'border-border bg-card hover:border-accent/50'
            }`}
          >
            {/* Selection Indicator */}
            {selectedStrategy === rec.strategy && (
              <div className="absolute top-3 right-3 bg-accent rounded-full p-1">
                <Check className="w-4 h-4 text-accent-foreground" />
              </div>
            )}

            {/* Strategy Icon */}
            <div className="mb-4 flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                {getStrategyIcon(rec.strategy)}
              </div>
              <h3 className="text-lg font-bold text-foreground uppercase">
                {rec.strategy}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>

            {/* Metrics */}
            <div className="space-y-2 mb-4 pb-4 border-b border-border">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Cost Efficiency</span>
                <div className="flex items-center gap-1">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${rec.efficiency}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">
                    {rec.efficiency}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Pick Efficiency</span>
                <div className="flex items-center gap-1">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-secondary transition-all"
                      style={{ width: `${rec.efficiency}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">
                    {rec.efficiency}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Coverage</span>
                <div className="flex items-center gap-1">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-status-success transition-all"
                      style={{ width: `${rec.coverage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">
                    {rec.coverage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-muted-foreground">Est. Cost:</span>
              <span className="text-lg font-bold text-accent">${rec.cost}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Details */}
      {selectedStrategy && (
        <div className="bg-card rounded-lg p-6 border border-border space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedStrategy.toUpperCase()} Strategy Details
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Items Affected</p>
              <p className="text-2xl font-bold text-foreground">{totalItems}</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Estimated Picking Time</p>
              <p className="text-2xl font-bold text-foreground">
                {selectedStrategy === 'fifo' ? '4.5' : selectedStrategy === 'fefo' ? '5.2' : '3.8'} hrs
              </p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Resource Allocation</p>
              <p className="text-2xl font-bold text-foreground">
                {selectedStrategy === 'fifo' ? '3' : selectedStrategy === 'fefo' ? '4' : '2'} workers
              </p>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border border-border">
            <h4 className="font-semibold text-foreground mb-2">Key Benefits</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {selectedStrategy === 'fifo' && (
                <>
                  <li>✓ Minimizes obsolescence and spoilage</li>
                  <li>✓ Standard across most industries</li>
                  <li>✓ Maintains consistent inventory turnover</li>
                  <li>✓ Reduces write-offs and discards</li>
                </>
              )}
              {selectedStrategy === 'fefo' && (
                <>
                  <li>✓ Critical for perishable goods</li>
                  <li>✓ Prevents expired items in shipment</li>
                  <li>✓ Improves customer satisfaction</li>
                  <li>✓ Regulatory compliance for food/pharma</li>
                </>
              )}
              {selectedStrategy === 'lifo' && (
                <>
                  <li>✓ Fastest picking and packing times</li>
                  <li>✓ Minimal warehouse travel distance</li>
                  <li>✓ Reduced labor costs</li>
                  <li>✓ Best for non-perishable items</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <ActionButton
          onClick={handleSelectStrategy}
          label="Confirm Strategy & Proceed"
          variant="primary"
          icon={Check}
          disabled={!selectedStrategy}
        />
      </div>
    </div>
  );
}
