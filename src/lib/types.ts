
export interface CustomProperties {
  isPriceListApplied: boolean;
  itemsInCart: number;
  isOfferApplied: boolean;
  inventoryCount: number;
  time: number;
}

export interface DataItem {
  customproperties: string;
  appversion: string;
  userid: number;
  deviceid: number;
  platform: string;
  osversion: string;
  parsedCustomProperties?: CustomProperties;
}

export interface DataResponse {
  data: {
    result: DataItem[];
  };
  status: number;
}

export type ComparisonOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'neq';

export interface Condition {
  field: keyof CustomProperties;
  operator: ComparisonOperator;
  value: number | boolean;
  id: string;
}

export interface ComparisonGroup {
  id: string;
  name: string;
  conditions: {
    [key: string]: boolean | number;
  };
}

export interface MetricConfig {
  id: string;
  field: keyof CustomProperties;
}

export interface DashboardConfig {
  metrics: MetricConfig[];
  baseConditions: Condition[];
  comparisonGroups: ComparisonGroup[];
  viewType: 'chart' | 'table';
  chartType: 'bar' | 'line';
  isAggregated: boolean;
}
