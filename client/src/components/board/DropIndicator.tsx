'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { TaskStatus } from '@/types';

interface DropIndicatorProps {
    status: TaskStatus;
    forceVisible?: boolean;
}

export default function DropIndicator({ status, forceVisible = false }: DropIndicatorProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `placeholder-${status}`,
        data: {
            type: 'ColumnPlaceholder',
            status,
        },
    });

    const isVisible = isOver || forceVisible;

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] w-full rounded-lg border-2 border-dashed transition-all duration-200 ease-out ${
                isVisible
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent' // Invisible normally
            }`}
        />
    );
}