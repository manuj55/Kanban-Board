'use client';

import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, selectTasksLoading } from '@/store/slices/tasksSlice';
import { selectCurrentTeamId } from '@/store/slices/teamsSlice';
import { toast } from 'sonner';
import KanbanColumn from './KanbanColumn';
import BoardDnDProvider from './BoardDnDProvider';
import SkeletonCard from './SkeletonCard';

export default function KanbanBoard() {
    const COLUMNS = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
    ] as const;

    const dispatch = useAppDispatch();
    const currentTeamId = useAppSelector(selectCurrentTeamId);
    const lastFetchedTeamId = useRef<string | null>(null);

    useEffect(() => {
        if (!currentTeamId) return;

        // Prevent fetching if already fetched for this team
        if (lastFetchedTeamId.current === currentTeamId) return;
        lastFetchedTeamId.current = currentTeamId;

        const loadTasks = async () => {
            try {
                await dispatch(fetchTasks(currentTeamId)).unwrap();
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to load tasks';
                toast.error(message, {
                    action: {
                        label: 'Retry',
                        onClick: () => dispatch(fetchTasks(currentTeamId)),
                    },
                });
            }
        };
        loadTasks();
    }, [dispatch, currentTeamId]);

    const loading = useAppSelector(selectTasksLoading);
    const tasks = useAppSelector((state) => state.tasks.tasks);
    const isInitialLoad = loading && tasks.length === 0;

    return (
        <>
            {isInitialLoad ? (
                <div className="flex flex-1 flex-col md:flex-row gap-sm md:gap-gutter md:overflow-x-auto md:snap-x md:snap-mandatory pb-md w-full">
                    {COLUMNS.map((col) => (
                        <div
                            key={col.id}
                            className="flex flex-col w-full md:min-w-[320px] md:w-[320px] lg:w-[360px] md:shrink-0 md:snap-start rounded-lg"
                        >
                            <div className="bg-surface-container-low/30 border-b-2 border-outline-variant/60 px-md py-sm mb-md flex items-center justify-between rounded-t-lg">
                                <h2 className="font-display font-semibold text-body-lg tracking-wide uppercase text-on-surface">
                                    {col.title}
                                </h2>
                            </div>
                            <div className="flex-1 px-sm flex flex-col gap-sm">
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <BoardDnDProvider>
                    <div className="flex flex-1 flex-col md:flex-row gap-sm md:gap-gutter md:overflow-x-auto md:snap-x md:snap-mandatory pb-md w-full">
                        {COLUMNS.map((col) => (
                            <KanbanColumn key={col.id} status={col.id} title={col.title} />
                        ))}
                    </div>
                </BoardDnDProvider>
            )}
        </>
    );
}