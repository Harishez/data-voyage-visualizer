
import React from 'react';
import { useDrop } from 'react-dnd';
import { cn } from "@/lib/utils";

interface DroppableAreaProps {
  accept: string | string[];
  onDrop: (item: any) => void;
  children: React.ReactNode;
  className?: string;
}

const DroppableArea = ({ accept, onDrop, children, className }: DroppableAreaProps) => {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={cn(
        "transition-all duration-200 rounded-md",
        canDrop && "bg-blue-50 dark:bg-blue-900/20",
        isOver && "ring-2 ring-blue-400 dark:ring-blue-600",
        className
      )}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
