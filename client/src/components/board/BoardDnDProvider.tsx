'use client';

import React from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateTask } from '@/store/slices/tasksSlice';
import { DragProvider, useDrag } from './DragContext';
import { MenuProvider, useMenu } from './MenuContext';

function BoardDnDProviderInner({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.tasks.tasks);
    const { setDragState } = useDrag();
    const { setOpenMenuId } = useMenu();

    const sensors = useSensors(
        usePointerSensor(),
        useKeyboardSensor()
    );

    function usePointerSensor() {
        return useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        });
    }

    function useKeyboardSensor() {
        return useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        });
    }

    const handleDragStart = (event: DragStartEvent) => {
        const activeId = event.active.id as string;
        const activeTask = tasks.find((t) => t._id === activeId);

        setDragState(true, activeTask?.status ?? null);
        setOpenMenuId(null); // Close all menus when drag starts
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setDragState(false, null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find((t) => t._id === activeId);
        if (!activeTask) return;

        let targetStatus = activeTask.status;
        let targetOrder = activeTask.order;

        // Check if dropping over a column placeholder
        if (overId.startsWith('placeholder-')) {
            targetStatus = over.data.current?.status;
            const columnTasks = tasks.filter((t) => t.status === targetStatus).sort((a, b) => a.order - b.order);
            targetOrder = columnTasks.length > 0 ? columnTasks[columnTasks.length - 1].order + 100 : 100;
        } else {
            // Dropping over another task
            const overTask = tasks.find((t) => t._id === overId);
            if (overTask) {
                targetStatus = overTask.status;
                const columnTasks = tasks.filter((t) => t.status === targetStatus).sort((a, b) => a.order - b.order);
                const overIndex = columnTasks.findIndex((t) => t._id === overId);

                if (active.id === overId) return; // Dropped on itself

                // Insert exactly at overIndex
                // For simplicity in integer-based: just re-order array and apply simple indexing for demo.
                const newOrder = overIndex * 100; // Integer logic. Proper implementation requires shifting or fractional.
                targetOrder = newOrder;
            }
        }

        if (activeTask.status !== targetStatus || activeTask.order !== targetOrder) {
            const columnChanged = activeTask.status !== targetStatus;
            const columnName =
                targetStatus === 'todo' ? 'To Do' :
                targetStatus === 'in-progress' ? 'In Progress' :
                'Done';

            dispatch(
                updateTask({ id: activeId, status: targetStatus, order: targetOrder })
            ).unwrap()
                .then(() => {
                    // Only show toast if column changed (not just reordering)
                    if (columnChanged) {
                        toast.success(`Moved to ${columnName}`);
                    }
                })
                .catch((error) => {
                    const message = error instanceof Error ? error.message : 'Failed to move task';
                    toast.error(message, {
                        action: {
                            label: 'Retry',
                            onClick: () => dispatch(updateTask({ id: activeId, status: targetStatus, order: targetOrder })),
                        },
                    });
                });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {children}
        </DndContext>
    );
}

export default function BoardDnDProvider({ children }: { children: React.ReactNode }) {
    return (
        <DragProvider>
            <MenuProvider>
                <BoardDnDProviderInner>{children}</BoardDnDProviderInner>
            </MenuProvider>
        </DragProvider>
    );
}