import React from 'react';
import type { TaskStatus } from '@/types';
import TaskList from './TaskList';

interface KanbanColumnProps {
    status: TaskStatus;
    title: string;
}

export default function KanbanColumn({ status, title }: KanbanColumnProps) {
    return (
        <div className="flex flex-col w-full md:min-w-[280px] md:w-[320px] shrink-0">
            {/* Header */}
            <div className="border-t border-b border-dashed border-outline-variant/40 py-xs mb-sm flex items-center justify-between">
                <h2 className="font-display font-semibold text-body-md tracking-wider uppercase text-on-surface">
                    {title}
                </h2>
            </div>

            {/* Task List (Droppable area) */}
            <div className="flex-1 pt-sm">
                <TaskList status={status} />
            </div>
        </div>
    );
}