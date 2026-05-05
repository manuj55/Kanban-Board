'use client';

import React from 'react';
import type { TaskStatus } from '@/types';
import TaskList from './TaskList';
import { useDrag } from './DragContext';
import { useAppSelector } from '@/store/hooks';
import { selectTasksByStatus } from '@/store/slices/tasksSlice';

interface KanbanColumnProps {
    status: TaskStatus;
    title: string;
}

export default function KanbanColumn({ status, title }: KanbanColumnProps) {
    const { isDraggingAny, sourceColumn } = useDrag();
    const tasks = useAppSelector(selectTasksByStatus(status));

    // Only highlight if dragging AND this is NOT the source column
    const isValidDropZone = isDraggingAny && sourceColumn !== status;

    return (
        <div
            className={`
                flex flex-col
                w-full
                md:min-w-[320px] md:w-[320px] lg:w-[360px]
                md:shrink-0
                md:snap-start
                rounded-lg
            `}
        >
            {/* Enhanced Header */}
            <div className="bg-surface-container-low/30 border-b-2 border-outline-variant/60 px-md py-sm mb-md flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-sm">
                    <h2 className="font-display font-semibold text-body-lg tracking-wide uppercase text-on-surface">
                        {title}
                    </h2>
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-sm rounded-full bg-surface-container text-label-sm font-semibold text-on-surface-variant">
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Task List (Droppable area) */}
            <div className="flex-1 px-sm">
                <TaskList status={status} isValidDropZone={isValidDropZone} />
            </div>
        </div>
    );
}