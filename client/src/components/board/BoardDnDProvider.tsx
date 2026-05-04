'use client';

import React, { useEffect } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateTask, fetchTasks } from '@/store/slices/tasksSlice';

export default function BoardDnDProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.tasks.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

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

    const handleDragEnd = (event: DragEndEvent) => {
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
            dispatch(
                updateTask({ id: activeId, status: targetStatus, order: targetOrder })
            );
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            {children}
        </DndContext>
    );
}