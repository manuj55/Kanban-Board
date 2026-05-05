'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { TaskStatus } from '@/types';

interface DragContextType {
    isDraggingAny: boolean;
    sourceColumn: TaskStatus | null;
    setDragState: (isDragging: boolean, sourceColumn?: TaskStatus | null) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export function DragProvider({ children }: { children: ReactNode }) {
    const [isDraggingAny, setIsDraggingAny] = useState(false);
    const [sourceColumn, setSourceColumn] = useState<TaskStatus | null>(null);

    const setDragState = (isDragging: boolean, source: TaskStatus | null = null) => {
        setIsDraggingAny(isDragging);
        setSourceColumn(source);
    };

    return (
        <DragContext.Provider value={{ isDraggingAny, sourceColumn, setDragState }}>
            {children}
        </DragContext.Provider>
    );
}

export function useDrag() {
    const context = useContext(DragContext);
    if (!context) {
        throw new Error('useDrag must be used within DragProvider');
    }
    return context;
}
