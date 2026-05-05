'use client';

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppSelector } from '@/store/hooks';
import { selectTasksByStatus, selectTasksLoading } from '@/store/slices/tasksSlice';
import type { TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import DropIndicator from './DropIndicator';
import SkeletonCard from './SkeletonCard';

interface TaskListProps {
    status: TaskStatus;
    isValidDropZone: boolean;
}

export default function TaskList({ status, isValidDropZone }: TaskListProps) {
    const loading = useAppSelector(selectTasksLoading);
    const tasks = useAppSelector(selectTasksByStatus(status));

    // Determine skeleton/empty states
    const showSkeleton = loading && tasks.length === 0;
    const showEmpty = !loading && tasks.length === 0;

    return (
        <div className={`flex flex-col gap-sm min-h-full transition-all duration-200 ${isValidDropZone ? 'gap-md' : ''}`}>
            <SortableContext
                items={tasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
            >
                {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                ))}
            </SortableContext>

            {showSkeleton && (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            )}

            {showEmpty && (
                <div className="flex flex-col items-center justify-center p-md border border-dashed border-outline-variant/40 rounded text-on-surface-variant text-body-sm">
                    No tasks left
                </div>
            )}

            {/* Drop zone - visible when valid drop target */}
            <DropIndicator status={status} forceVisible={isValidDropZone && tasks.length === 0} />
        </div>
    );
}