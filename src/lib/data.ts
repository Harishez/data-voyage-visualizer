import { DataResponse, CustomProperties, Condition, ComparisonGroup, DataItem, ComparisonOperator } from './types';

// Sample data as provided in the prompt
export const sampleData: DataResponse = {
  data: {
    result: [
      {
        customproperties: "{\"isPriceListApplied\":false,\"itemsInCart\":18,\"isOfferApplied\":true,\"inventoryCount\":349,\"time\":0}",
        appversion: "3.7.0",
        userid: 0,
        deviceid: 2141999127683,
        platform: "Android",
        osversion: "10"
      },
      {
        customproperties: "{\"isPriceListApplied\":false,\"itemsInCart\":19,\"isOfferApplied\":true,\"inventoryCount\":329,\"time\":0}",
        appversion: "3.7.0",
        userid: 0,
        deviceid: 2141999127683,
        platform: "Android",
        osversion: "10"
      },
      {
        customproperties: "{\"isPriceListApplied\":true,\"itemsInCart\":12,\"isOfferApplied\":false,\"inventoryCount\":245,\"time\":10}",
        appversion: "3.7.0",
        userid: 0,
        deviceid: 2141999127684,
        platform: "iOS",
        osversion: "14"
      },
      {
        customproperties: "{\"isPriceListApplied\":true,\"itemsInCart\":8,\"isOfferApplied\":false,\"inventoryCount\":120,\"time\":15}",
        appversion: "3.7.0",
        userid: 0,
        deviceid: 2141999127685,
        platform: "Android",
        osversion: "11"
      },
      {
        customproperties: "{\"isPriceListApplied\":false,\"itemsInCart\":22,\"isOfferApplied\":false,\"inventoryCount\":80,\"time\":20}",
        appversion: "3.7.0",
        userid: 0,
        deviceid: 2141999127686,
        platform: "iOS",
        osversion: "15"
      }
    ]
  },
  status: 200
};

// Generate more sample data for better visualization
export const generateMoreData = (count: number): DataResponse => {
  const result: DataItem[] = [...sampleData.data.result];
  
  for (let i = 0; i < count; i++) {
    const isPriceListApplied = Math.random() > 0.5;
    const isOfferApplied = Math.random() > 0.5;
    const itemsInCart = Math.floor(Math.random() * 30) + 1;
    const inventoryCount = Math.floor(Math.random() * 500) + 50;
    const time = Math.floor(Math.random() * 100);
    
    result.push({
      customproperties: JSON.stringify({
        isPriceListApplied,
        itemsInCart,
        isOfferApplied,
        inventoryCount,
        time
      }),
      appversion: "3.7.0",
      userid: 0,
      deviceid: 2141999127690 + i,
      platform: Math.random() > 0.5 ? "Android" : "iOS",
      osversion: Math.random() > 0.5 ? "10" : "15"
    });
  }
  
  return {
    data: { result },
    status: 200
  };
};

// Parse custom properties from string to object
export const parseData = (data: DataResponse): DataItem[] => {
  return data.data.result.map(item => {
    try {
      const parsedCustomProperties = JSON.parse(item.customproperties) as CustomProperties;
      return {
        ...item,
        parsedCustomProperties
      };
    } catch (error) {
      console.error("Error parsing custom properties:", error);
      return item;
    }
  });
};

// Filter data based on conditions
export const filterDataByConditions = (data: DataItem[], conditions: Condition[]): DataItem[] => {
  return data.filter(item => {
    if (!item.parsedCustomProperties) return false;
    
    return conditions.every(condition => {
      const value = item.parsedCustomProperties![condition.field];
      
      switch (condition.operator) {
        case 'gt': return typeof value === 'number' && value > Number(condition.value);
        case 'lt': return typeof value === 'number' && value < Number(condition.value);
        case 'gte': return typeof value === 'number' && value >= Number(condition.value);
        case 'lte': return typeof value === 'number' && value <= Number(condition.value);
        case 'eq': 
          if (typeof value === 'boolean' && typeof condition.value === 'boolean') {
            return value === condition.value;
          } else if (typeof value === 'number') {
            return value === Number(condition.value);
          }
          return value === condition.value;
        case 'neq': 
          if (typeof value === 'boolean' && typeof condition.value === 'boolean') {
            return value !== condition.value;
          } else if (typeof value === 'number') {
            return value !== Number(condition.value);
          }
          return value !== condition.value;
        default: return true;
      }
    });
  });
};

// Group data by comparison groups
export const groupDataByComparisons = (
  data: DataItem[], 
  comparisonGroups: ComparisonGroup[]
): Record<string, DataItem[]> => {
  const groups: Record<string, DataItem[]> = {};
  
  comparisonGroups.forEach(group => {
    groups[group.id] = data.filter(item => {
      if (!item.parsedCustomProperties) return false;
      
      return Object.entries(group.conditions).every(([field, value]) => {
        const itemValue = item.parsedCustomProperties![field as keyof CustomProperties];
        return itemValue === value;
      });
    });
  });
  
  return groups;
};

// Get property options for metrics and conditions
export const getPropertyOptions = (): Array<{ label: string; value: keyof CustomProperties; type: 'number' | 'boolean' }> => {
  return [
    { label: 'Inventory Count', value: 'inventoryCount', type: 'number' },
    { label: 'Items in Cart', value: 'itemsInCart', type: 'number' },
    { label: 'Time', value: 'time', type: 'number' },
    { label: 'Is Price List Applied', value: 'isPriceListApplied', type: 'boolean' },
    { label: 'Is Offer Applied', value: 'isOfferApplied', type: 'boolean' }
  ];
};

// Get operator options
export const getOperatorOptions = (type: 'number' | 'boolean'): Array<{ label: string; value: ComparisonOperator }> => {
  if (type === 'boolean') {
    return [
      { label: 'Equals', value: 'eq' },
      { label: 'Not Equals', value: 'neq' }
    ];
  }
  
  return [
    { label: 'Greater Than', value: 'gt' },
    { label: 'Less Than', value: 'lt' },
    { label: 'Greater Than or Equal', value: 'gte' },
    { label: 'Less Than or Equal', value: 'lte' },
    { label: 'Equals', value: 'eq' },
    { label: 'Not Equals', value: 'neq' }
  ];
};

// Prepare chart data
export const prepareChartData = (
  groupedData: Record<string, DataItem[]>,
  metrics: string[],
  isAggregated: boolean
) => {
  if (isAggregated) {
    // For aggregated view, calculate average, sum, etc.
    return Object.entries(groupedData).map(([groupId, items]) => {
      const result: Record<string, any> = { name: groupId };
      
      metrics.forEach(metric => {
        const values = items
          .filter(item => item.parsedCustomProperties)
          .map(item => item.parsedCustomProperties![metric as keyof CustomProperties]);
        
        // Calculate average for numeric values
        if (values.length > 0 && typeof values[0] === 'number') {
          const sum = values.reduce((acc, val) => acc + (val as number), 0);
          result[metric] = sum / values.length;
        } else if (values.length > 0 && typeof values[0] === 'boolean') {
          // For boolean, calculate percentage of true values
          const trueCount = values.filter(v => v === true).length;
          result[metric] = (trueCount / values.length) * 100;
        }
      });
      
      return result;
    });
  } else {
    // For raw data view, flatten all items with group ID
    const result: any[] = [];
    
    Object.entries(groupedData).forEach(([groupId, items]) => {
      items.forEach(item => {
        if (item.parsedCustomProperties) {
          const entry: Record<string, any> = { 
            group: groupId,
          };
          
          metrics.forEach(metric => {
            entry[metric] = item.parsedCustomProperties![metric as keyof CustomProperties];
          });
          
          result.push(entry);
        }
      });
    });
    
    return result;
  }
};

// Initial data with 20 more random entries
export const initialData = parseData(generateMoreData(20));
