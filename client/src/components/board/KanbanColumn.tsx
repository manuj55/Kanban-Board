import React from 'react';
import type { TaskStatus } from '@/types';
import TaskList from './TaskList';

interface KanbanColumnProps {
    status: TaskStatus;
    title: string;
}

export default function KanbanColumn({ status, title }: KanbanColumnProps) {
    return (
        <div className="flex flex-col min-w-[280px] w-[350px] shrink-0">
            {/* Header */}
            <div className="border-t border-b border-dashed border-outline-variant/30 py-sm mb-md flex items-center justify-between">
                <h2 className="font-display font-bold text-headline-md tracking-tight uppercase text-on-surface">
                    {title}
                </h2>
            </div>

            {/* Task List (Droppable area) */}
            <div className="flex-1 bg-surface-container-lowest/50 rounded p-sm">
                <TaskList status={status} />
            </div>
        </div>
    );
}