
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, Plus } from 'lucide-react';
import DroppableArea from './DroppableArea';
import { Condition, ComparisonOperator } from '@/lib/types';
import { getOperatorOptions } from '@/lib/data';

interface ConditionBuilderProps {
  conditions: Condition[];
  onAddCondition: (condition: Omit<Condition, 'id'>) => void;
  onUpdateCondition: (id: string, updates: Partial<Condition>) => void;
  onRemoveCondition: (id: string) => void;
}

const ConditionBuilder = ({ 
  conditions, 
  onAddCondition, 
  onUpdateCondition,
  onRemoveCondition 
}: ConditionBuilderProps) => {
  const [draftField, setDraftField] = useState<string>('');
  const [draftOperator, setDraftOperator] = useState<ComparisonOperator>('gt');
  const [draftValue, setDraftValue] = useState<number | boolean>(0);
  const [fieldType, setFieldType] = useState<'number' | 'boolean'>('number');
  
  const handleDrop = (item: any) => {
    setDraftField(item.value);
    setFieldType(item.type);
    setDraftValue(item.type === 'boolean' ? false : 0);
    setDraftOperator(item.type === 'boolean' ? 'eq' : 'gt');
  };
  
  const handleAddCondition = () => {
    if (draftField) {
      onAddCondition({
        field: draftField as any,
        operator: draftOperator,
        value: draftValue
      });
      setDraftField('');
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
  
  const getOperatorLabel = (operator: ComparisonOperator): string => {
    switch (operator) {
      case 'gt': return '>';
      case 'lt': return '<';
      case 'gte': return '≥';
      case 'lte': return '≤';
      case 'eq': return '=';
      case 'neq': return '≠';
      default: return operator;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Conditions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <DroppableArea 
          accept="property"
          onDrop={handleDrop}
          className="p-3 border border-dashed border-slate-200 dark:border-slate-700 rounded-md"
        >
          <div className="grid gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Drop a property here to create a condition
            </p>
            
            {draftField && (
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">{getPropertyLabel(draftField)}</div>
                  
                  <Select
                    value={draftOperator}
                    onValueChange={(value) => setDraftOperator(value as ComparisonOperator)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getOperatorOptions(fieldType).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {fieldType === 'boolean' ? (
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={draftValue as boolean} 
                        onCheckedChange={(checked) => setDraftValue(checked)} 
                      />
                      <Label>{draftValue ? 'True' : 'False'}</Label>
                    </div>
                  ) : (
                    <div className="grid gap-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{draftValue}</span>
                      </div>
                      <Slider
                        value={[draftValue as number]}
                        min={0}
                        max={500}
                        step={1}
                        onValueChange={(values) => setDraftValue(values[0])}
                      />
                    </div>
                  )}
                  
                  <Button 
                    size="sm" 
                    onClick={handleAddCondition}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DroppableArea>
        
        {conditions.length > 0 && (
          <div className="space-y-3 mt-2">
            <h4 className="text-sm font-medium">Applied Conditions:</h4>
            {conditions.map((condition) => (
              <div 
                key={condition.id} 
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getPropertyLabel(condition.field)}</span>
                  <span className="text-sm font-medium">{getOperatorLabel(condition.operator)}</span>
                  
                  {typeof condition.value === 'boolean' ? (
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={condition.value} 
                        onCheckedChange={(checked) => 
                          onUpdateCondition(condition.id, { value: checked })
                        }
                      />
                      <Label>{condition.value ? 'True' : 'False'}</Label>
                    </div>
                  ) : (
                    <div className="grid gap-2 flex-1 w-[150px]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{condition.value}</span>
                      </div>
                      <Slider
                        value={[condition.value as number]}
                        min={0}
                        max={500}
                        step={1}
                        onValueChange={(values) => 
                          onUpdateCondition(condition.id, { value: values[0] })
                        }
                      />
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCondition(condition.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConditionBuilder;
