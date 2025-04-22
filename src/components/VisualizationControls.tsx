
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface VisualizationControlsProps {
  viewType: 'chart' | 'table';
  chartType: 'bar' | 'line';
  isAggregated: boolean;
  onViewTypeChange: (type: 'chart' | 'table') => void;
  onChartTypeChange: (type: 'bar' | 'line') => void;
  onAggregationChange: (isAggregated: boolean) => void;
  onRefresh: () => void;
}

const VisualizationControls = ({
  viewType,
  chartType,
  isAggregated,
  onViewTypeChange,
  onChartTypeChange,
  onAggregationChange,
  onRefresh
}: VisualizationControlsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Visualization Options</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>View Type</Label>
          <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && onViewTypeChange(value as 'chart' | 'table')}>
            <ToggleGroupItem value="chart" className="text-xs">Chart</ToggleGroupItem>
            <ToggleGroupItem value="table" className="text-xs">Table</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {viewType === 'chart' && (
          <div className="grid gap-2">
            <Label>Chart Type</Label>
            <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && onChartTypeChange(value as 'bar' | 'line')}>
              <ToggleGroupItem value="bar" className="text-xs">Bar Chart</ToggleGroupItem>
              <ToggleGroupItem value="line" className="text-xs">Line Chart</ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Switch
            id="aggregation"
            checked={isAggregated}
            onCheckedChange={onAggregationChange}
          />
          <Label htmlFor="aggregation">Aggregate Data</Label>
        </div>
        
        <Button onClick={onRefresh} className="mt-2">
          Refresh Visualization
        </Button>
      </CardContent>
    </Card>
  );
};

export default VisualizationControls;
