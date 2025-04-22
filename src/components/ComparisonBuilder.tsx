
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, X } from 'lucide-react';
import DroppableArea from './DroppableArea';
import { ComparisonGroup } from '@/lib/types';

interface ComparisonBuilderProps {
  comparisonGroups: ComparisonGroup[];
  onAddComparison: (comparison: Omit<ComparisonGroup, 'id'>) => void;
  onRemoveComparison: (id: string) => void;
}

const ComparisonBuilder = ({ 
  comparisonGroups, 
  onAddComparison, 
  onRemoveComparison 
}: ComparisonBuilderProps) => {
  const [groupName, setGroupName] = useState('');
  const [conditions, setConditions] = useState<{ [key: string]: boolean | number }>({});
  const [property, setProperty] = useState<string>('');
  const [propertyType, setPropertyType] = useState<'number' | 'boolean'>('boolean');
  const [propertyValue, setPropertyValue] = useState<boolean | number>(false);

  const handleDrop = (item: any) => {
    setProperty(item.value);
    setPropertyType(item.type);
    setPropertyValue(item.type === 'boolean' ? false : 0);
  };
  
  const handleAddProperty = () => {
    if (property && groupName) {
      setConditions(prev => ({
        ...prev,
        [property]: propertyValue
      }));
      setProperty('');
    }
  };
  
  const handleAddGroup = () => {
    if (groupName && Object.keys(conditions).length > 0) {
      onAddComparison({
        name: groupName,
        conditions: { ...conditions }
      });
      setGroupName('');
      setConditions({});
    }
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
        <CardTitle className="text-sm font-medium">Comparison Groups</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="group-name">Group Name</Label>
          <Input
            id="group-name"
            placeholder="e.g., Offer Applied & No Price List"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        
        <DroppableArea 
          accept="property"
          onDrop={handleDrop}
          className="p-3 border border-dashed border-slate-200 dark:border-slate-700 rounded-md"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drop properties here to create comparison criteria
          </p>
          
          {property && (
            <div className="mt-3 grid gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{getPropertyLabel(property)}:</span>
                
                {propertyType === 'boolean' ? (
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={propertyValue as boolean} 
                      onCheckedChange={(checked) => setPropertyValue(checked)} 
                    />
                    <Label>{propertyValue ? 'True' : 'False'}</Label>
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={propertyValue as number}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-24"
                  />
                )}
                
                <Button 
                  size="sm" 
                  onClick={handleAddProperty}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DroppableArea>
        
        {Object.keys(conditions).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Group Conditions:</h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              {Object.entries(conditions).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 py-1">
                  <span className="text-sm">{getPropertyLabel(key)}:</span>
                  <span className="text-sm font-medium">
                    {typeof value === 'boolean' ? (value ? 'True' : 'False') : value}
                  </span>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddGroup}
                className="mt-2"
              >
                Add Comparison Group
              </Button>
            </div>
          </div>
        )}
        
        {comparisonGroups.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Defined Comparison Groups:</h4>
            <div className="grid gap-2">
              {comparisonGroups.map((group) => (
                <div 
                  key={group.id} 
                  className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium">{group.name}</h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveComparison(group.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid gap-1">
                    {Object.entries(group.conditions).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs">{getPropertyLabel(key)}:</span>
                        <span className="text-xs font-medium">
                          {typeof value === 'boolean' ? (value ? 'True' : 'False') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonBuilder;
