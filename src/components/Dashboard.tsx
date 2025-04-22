
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useToast } from "@/components/ui/use-toast";
import PropertySelector from './PropertySelector';
import MetricsList from './MetricsList';
import ConditionBuilder from './ConditionBuilder';
import ComparisonBuilder from './ComparisonBuilder';
import VisualizationControls from './VisualizationControls';
import DataVisualization from './DataVisualization';
import { initialData, filterDataByConditions, groupDataByComparisons, prepareChartData } from '@/lib/data';
import { Condition, MetricConfig, ComparisonGroup, DashboardConfig } from '@/lib/types';

const Dashboard = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<DashboardConfig>({
    metrics: [],
    baseConditions: [],
    comparisonGroups: [],
    viewType: 'chart',
    chartType: 'bar',
    isAggregated: true,
  });
  const [visualizationData, setVisualizationData] = useState<any[]>([]);
  
  // For generating unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  // Add a new metric from the property drag
  const handleAddMetric = (field: string) => {
    // Check if metric already exists
    if (config.metrics.some(metric => metric.field === field)) {
      toast({
        title: "Metric already added",
        description: "This metric is already in your selection.",
        variant: "destructive"
      });
      return;
    }
    
    setConfig(prev => ({
      ...prev,
      metrics: [...prev.metrics, { id: generateId(), field: field as any }]
    }));
  };
  
  // Remove a metric
  const handleRemoveMetric = (id: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.filter(metric => metric.id !== id)
    }));
  };
  
  // Add a condition
  const handleAddCondition = (condition: Omit<Condition, 'id'>) => {
    setConfig(prev => ({
      ...prev,
      baseConditions: [...prev.baseConditions, { ...condition, id: generateId() }]
    }));
  };
  
  // Update a condition
  const handleUpdateCondition = (id: string, updates: Partial<Condition>) => {
    setConfig(prev => ({
      ...prev,
      baseConditions: prev.baseConditions.map(condition =>
        condition.id === id ? { ...condition, ...updates } : condition
      )
    }));
  };
  
  // Remove a condition
  const handleRemoveCondition = (id: string) => {
    setConfig(prev => ({
      ...prev,
      baseConditions: prev.baseConditions.filter(condition => condition.id !== id)
    }));
  };
  
  // Add a comparison group
  const handleAddComparison = (comparison: Omit<ComparisonGroup, 'id'>) => {
    setConfig(prev => ({
      ...prev,
      comparisonGroups: [...prev.comparisonGroups, { ...comparison, id: generateId() }]
    }));
  };
  
  // Remove a comparison group
  const handleRemoveComparison = (id: string) => {
    setConfig(prev => ({
      ...prev,
      comparisonGroups: prev.comparisonGroups.filter(group => group.id !== id)
    }));
  };
  
  // Change view type (chart or table)
  const handleViewTypeChange = (viewType: 'chart' | 'table') => {
    setConfig(prev => ({ ...prev, viewType }));
  };
  
  // Change chart type (bar or line)
  const handleChartTypeChange = (chartType: 'bar' | 'line') => {
    setConfig(prev => ({ ...prev, chartType }));
  };
  
  // Toggle data aggregation
  const handleAggregationChange = (isAggregated: boolean) => {
    setConfig(prev => ({ ...prev, isAggregated }));
  };
  
  // Process data based on current configuration
  const processData = () => {
    // First apply base conditions to all data
    const filteredData = filterDataByConditions(initialData, config.baseConditions);
    
    // Then group by comparison criteria
    const groupedData = groupDataByComparisons(
      filteredData,
      config.comparisonGroups.length > 0 
        ? config.comparisonGroups 
        : [{ id: 'all', name: 'All Data', conditions: {} }]
    );
    
    // Prepare data for visualization
    const chartData = prepareChartData(
      groupedData,
      config.metrics.map(m => m.field),
      config.isAggregated
    );
    
    setVisualizationData(chartData);
    
    toast({
      title: "Data refreshed",
      description: `Showing ${chartData.length} data points based on your criteria.`,
    });
  };
  
  // Initial data processing
  useEffect(() => {
    if (config.metrics.length > 0) {
      processData();
    }
  }, []);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Data Voyage Visualizer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <PropertySelector title="Available Properties" dragType="property" />
          </div>
          
          <div>
            <MetricsList 
              metrics={config.metrics} 
              onAddMetric={handleAddMetric}
              onRemoveMetric={handleRemoveMetric}
            />
          </div>
          
          <div>
            <ConditionBuilder 
              conditions={config.baseConditions}
              onAddCondition={handleAddCondition}
              onUpdateCondition={handleUpdateCondition}
              onRemoveCondition={handleRemoveCondition}
            />
          </div>
          
          <div>
            <ComparisonBuilder 
              comparisonGroups={config.comparisonGroups}
              onAddComparison={handleAddComparison}
              onRemoveComparison={handleRemoveComparison}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <VisualizationControls 
              viewType={config.viewType}
              chartType={config.chartType}
              isAggregated={config.isAggregated}
              onViewTypeChange={handleViewTypeChange}
              onChartTypeChange={handleChartTypeChange}
              onAggregationChange={handleAggregationChange}
              onRefresh={processData}
            />
          </div>
          
          <div className="md:col-span-3">
            <DataVisualization 
              data={visualizationData}
              metrics={config.metrics}
              viewType={config.viewType}
              chartType={config.chartType}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
