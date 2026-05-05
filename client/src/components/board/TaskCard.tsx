'use client';

import React, { useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { updateTask, deleteTask } from '@/store/slices/tasksSlice';
import { useMenu } from './MenuContext';
import type { Task, TaskStatus } from '@/types';

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const dispatch = useAppDispatch();
    const { openMenuId, setOpenMenuId } = useMenu();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuContainerRef = useRef<HTMLDivElement>(null);

    // Check if THIS card's menu is open
    const isMenuOpen = openMenuId === task._id;

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

    // Close menu when clicking outside
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // Check if click is outside both button AND menu container
            const isOutsideButton = menuButtonRef.current && !menuButtonRef.current.contains(target);
            const isOutsideMenu = menuContainerRef.current && !menuContainerRef.current.contains(target);

            if (isOutsideButton && isOutsideMenu) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen, setOpenMenuId]);

    // Close menu when dragging starts
    useEffect(() => {
        if (isDragging && isMenuOpen) {
            setOpenMenuId(null);
        }
    }, [isDragging, isMenuOpen, setOpenMenuId]);

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Don't trigger drag
        setOpenMenuId(isMenuOpen ? null : task._id);
    };

    const handleMove = async (newStatus: TaskStatus) => {
        setOpenMenuId(null);
        try {
            await dispatch(updateTask({ id: task._id, status: newStatus })).unwrap();
            toast.success(`Task moved to ${newStatus === 'todo' ? 'To Do' : newStatus === 'in-progress' ? 'In Progress' : 'Done'}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to move task';
            toast.error(message, {
                action: {
                    label: 'Retry',
                    onClick: () => handleMove(newStatus),
                },
            });
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteTask(task._id)).unwrap();
            toast.success('Task deleted');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete task';
            toast.error(message, {
                action: {
                    label: 'Retry',
                    onClick: handleDelete,
                },
            });
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group bg-surface-container-lowest border border-outline-variant/40 rounded-lg overflow-visible transition-all duration-200 ease-out ${accentClass} ${
                isDragging
                    ? 'scale-105 opacity-50 border-primary shadow-soft cursor-grabbing z-[1]'
                    : 'scale-100 opacity-100 hover:border-primary-container/60 hover:shadow-[0_6px_12px_rgba(15,23,42,0.08)] hover:-translate-y-0.5'
            } ${isMenuOpen ? 'z-[51]' : 'z-[1]'}`}
        >
            {/* Draggable area */}
            <div className="p-md cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <div className="flex justify-between items-start gap-sm mb-xs">
                    <h4 className="text-body-md font-semibold text-on-surface line-clamp-2">
                        {task.title}
                    </h4>
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

            {/* Dropdown Menu Toggle - Outside drag area */}
            <div className="absolute top-md right-md">
                <button
                    ref={menuButtonRef}
                    onClick={handleMenuToggle}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    aria-label="Open menu"
                    aria-expanded={isMenuOpen}
                >
                    •••
                </button>
                {isMenuOpen && (
                    <div
                        ref={menuContainerRef}
                        className="absolute right-0 top-full mt-sm bg-surface-container-lowest border border-outline-variant/40 rounded shadow-soft z-50 w-40 py-xs"
                    >
                        {task.status !== 'todo' && (
                            <button onClick={() => handleMove('todo')} className="w-full text-left px-sm py-sm min-h-[44px] text-body-sm text-on-surface hover:bg-surface-bright transition-colors">
                                Move to To Do
                            </button>
                        )}
                        {task.status !== 'in-progress' && (
                            <button onClick={() => handleMove('in-progress')} className="w-full text-left px-sm py-sm min-h-[44px] text-body-sm text-on-surface hover:bg-surface-bright transition-colors">
                                Move to In Progress
                            </button>
                        )}
                        {task.status !== 'done' && (
                            <button onClick={() => handleMove('done')} className="w-full text-left px-sm py-sm min-h-[44px] text-body-sm text-on-surface hover:bg-surface-bright transition-colors">
                                Move to Done
                            </button>
                        )}
                        <div className="h-[1px] bg-outline-variant/50 my-xs" />
                        <button onClick={handleDelete} className="w-full text-left px-sm py-sm min-h-[44px] text-body-sm text-error hover:bg-error/10 transition-colors">
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}