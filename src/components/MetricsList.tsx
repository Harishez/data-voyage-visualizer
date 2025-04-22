
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DroppableArea from './DroppableArea';
import { X } from 'lucide-react';
import { MetricConfig } from '@/lib/types';

interface MetricsListProps {
  metrics: MetricConfig[];
  onAddMetric: (field: string) => void;
  onRemoveMetric: (id: string) => void;
}

const MetricsList = ({ metrics, onAddMetric, onRemoveMetric }: MetricsListProps) => {
  const handleDrop = (item: any) => {
    onAddMetric(item.value);
  };

  const getPropertyLabel = (field: string): string => {
    switch (field) {
      case 'inventoryCount': return 'Inventory Count';
      case 'itemsInCart': return 'Items in Cart';
      case 'time': return 'Time';
      case 'isPriceListApplied': return 'Is Price List Applied';
      case 'isOfferApplied': return 'Is Offer Applied';
      default: return field;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Selected Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <DroppableArea 
          accept="property"
          onDrop={handleDrop}
          className={`min-h-[100px] p-2 ${metrics.length === 0 ? 'border-2 border-dashed border-slate-200 dark:border-slate-700' : ''}`}
        >
          {metrics.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-slate-500 dark:text-slate-400">Drag properties here to add as metrics</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800"
                >
                  <span className="text-sm">{getPropertyLabel(metric.field)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveMetric(metric.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DroppableArea>
      </CardContent>
    </Card>
  );
};

export default MetricsList;
