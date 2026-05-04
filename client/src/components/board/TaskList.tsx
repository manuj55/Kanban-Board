'use client';

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppSelector } from '@/store/hooks';
import { selectTasksByStatus, selectTasksLoading } from '@/store/slices/tasksSlice';
import type { TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import DropIndicator from './DropIndicator';

interface TaskListProps {
    status: TaskStatus;
}

export default function TaskList({ status }: TaskListProps) {
    const loading = useAppSelector(selectTasksLoading);
    const tasks = useAppSelector(selectTasksByStatus(status));

    // Determine skeleton/empty states
    const showSkeleton = loading && tasks.length === 0;
    const showEmpty = !loading && tasks.length === 0;

    return (
        <div className="flex flex-col gap-sm min-h-full">
            <SortableContext
                items={tasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
            >
                {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                ))}
            </SortableContext>

            {showSkeleton && (
                <div className="h-24 bg-surface-container rounded animate-pulse" />
            )}

            {showEmpty && (
                <div className="flex flex-col items-center justify-center p-md border border-dashed border-outline-variant rounded text-on-surface-variant text-body-sm">
                    No tasks left
                </div>
            )}

            {/* Invisible drop zone when empty to allow dragging into empty columns */}
            <DropIndicator status={status} />
        </div>
    );
}