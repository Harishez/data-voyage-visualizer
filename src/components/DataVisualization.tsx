
import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricConfig } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";

interface DataVisualizationProps {
  data: any[];
  metrics: MetricConfig[];
  viewType: 'chart' | 'table';
  chartType: 'bar' | 'line';
  isLoading?: boolean;
}

const colors = [
  "#2563eb", // blue
  "#16a34a", // green
  "#d97706", // amber
  "#dc2626", // red
  "#8b5cf6", // violet
  "#0891b2", // cyan
];

const DataVisualization = ({ 
  data, 
  metrics, 
  viewType, 
  chartType,
  isLoading = false 
}: DataVisualizationProps) => {
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Loading data visualization...</p>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">No Data to Display</h3>
            <p className="text-sm text-muted-foreground">
              Select metrics, set conditions, and add comparison groups to visualize data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (viewType === 'chart') {
    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.map((metric, index) => (
                <Bar
                  key={metric.id}
                  type="monotone"
                  dataKey={metric.field}
                  name={getPropertyLabel(metric.field)}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.map((metric, index) => (
                <Line
                  key={metric.id}
                  type="monotone"
                  dataKey={metric.field}
                  name={getPropertyLabel(metric.field)}
                  stroke={colors[index % colors.length]}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  } else {
    return (
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              {metrics.map((metric) => (
                <TableHead key={metric.id}>{getPropertyLabel(metric.field)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.group || item.name}</TableCell>
                {metrics.map((metric) => (
                  <TableCell key={metric.id}>
                    {typeof item[metric.field] === 'boolean' 
                      ? (item[metric.field] ? 'True' : 'False')
                      : typeof item[metric.field] === 'number' && !isNaN(item[metric.field])
                        ? Number(item[metric.field]).toFixed(2)
                        : item[metric.field]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default DataVisualization;
