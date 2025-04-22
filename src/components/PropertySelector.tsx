
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DraggableItem from './DraggableItem';
import { getPropertyOptions } from '@/lib/data';

interface PropertySelectorProps {
  title: string;
  dragType: string;
}

const PropertySelector = ({ title, dragType }: PropertySelectorProps) => {
  const properties = getPropertyOptions();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {properties.map((property) => (
          <DraggableItem 
            key={property.value} 
            id={property.value.toString()}
            type={dragType}
            data={property}
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <span className="text-sm">{property.label}</span>
          </DraggableItem>
        ))}
      </CardContent>
    </Card>
  );
};

export default PropertySelector;
