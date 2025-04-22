
import React from 'react';
import { useDrag } from 'react-dnd';
import { cn } from "@/lib/utils";

interface DraggableItemProps {
  id: string;
  type: string;
  data: any;
  children: React.ReactNode;
  className?: string;
}

const DraggableItem = ({ id, type, data, children, className }: DraggableItemProps) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type,
    item: { id, ...data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={cn(
        "px-3 py-2 rounded-md cursor-move border transition-colors",
        isDragging ? "opacity-50 border-dashed" : "opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
