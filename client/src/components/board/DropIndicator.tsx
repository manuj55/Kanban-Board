'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { TaskStatus } from '@/types';

interface DropIndicatorProps {
    status: TaskStatus;
}

export default function DropIndicator({ status }: DropIndicatorProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `placeholder-${status}`,
        data: {
            type: 'ColumnPlaceholder',
            status,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] w-full rounded border-2 border-dashed transition-colors ${isOver
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent' // Invisible normally
                }`}
        />
    );
}