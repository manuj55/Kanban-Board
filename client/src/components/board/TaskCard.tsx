'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch } from '@/store/hooks';
import { updateTask, deleteTask } from '@/store/slices/tasksSlice';
import type { Task, TaskStatus } from '@/types';

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const dispatch = useAppDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const accentClass =
        task.status === 'todo'
            ? 'accent-bar-todo'
            : task.status === 'in-progress'
                ? 'accent-bar-in-progress'
                : 'accent-bar-done';

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleMove = (newStatus: TaskStatus) => {
        dispatch(updateTask({ id: task._id, status: newStatus }));
        setMenuOpen(false);
    };

    const handleDelete = () => {
        dispatch(deleteTask(task._id));
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group bg-surface-container-lowest border border-outline-variant/40 rounded-lg overflow-visible transition-colors ${accentClass} ${isDragging ? 'border-primary-container shadow-soft' : 'hover:border-primary-container/60'
                }`}
        >
            <div className="p-md" {...attributes} {...listeners}>
                <div className="flex justify-between items-start gap-sm mb-xs">
                    <h4 className="text-body-md font-semibold text-on-surface line-clamp-2">
                        {task.title}
                    </h4>

                    {/* Dropdown Menu Toggle - Requires a click overlay handler normally, simplified here */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // don't drag
                                setMenuOpen(!menuOpen);
                            }}
                            className="text-on-surface-variant hover:text-primary transition-colors p-[2px]"
                        >
                            •••
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-xs bg-surface-container-lowest border border-outline-variant/40 rounded shadow-soft z-10 w-32 py-xs">
                                {task.status !== 'todo' && (
                                    <button onClick={() => handleMove('todo')} className="w-full text-left px-sm py-[2px] text-body-sm text-on-surface hover:bg-surface-bright">Move to To Do</button>
                                )}
                                {task.status !== 'in-progress' && (
                                    <button onClick={() => handleMove('in-progress')} className="w-full text-left px-sm py-[2px] text-body-sm text-on-surface hover:bg-surface-bright">Move to In Progress</button>
                                )}
                                {task.status !== 'done' && (
                                    <button onClick={() => handleMove('done')} className="w-full text-left px-sm py-[2px] text-body-sm text-on-surface hover:bg-surface-bright">Move to Done</button>
                                )}
                                <div className="h-[1px] bg-outline-variant/50 my-xs" />
                                <button onClick={handleDelete} className="w-full text-left px-sm py-[2px] text-body-sm text-error hover:bg-error/10">Delete</button>
                            </div>
                        )}
                    </div>
                </div>

                {task.description && (
                    <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-sm">
                        {task.description}
                    </p>
                )}

                <div className="flex items-center text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    {new Date(task.dueDate).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}