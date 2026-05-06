'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { selectTasksLoading } from '@/store/slices/tasksSlice';
import { selectCurrentTeam } from '@/store/slices/teamsSlice';
import KanbanColumn from './KanbanColumn';
import BoardDnDProvider from './BoardDnDProvider';
import SkeletonCard from './SkeletonCard';

export default function KanbanBoard() {
    const COLUMNS = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
    ] as const;

    const loading = useAppSelector(selectTasksLoading);
    const tasks = useAppSelector((state) => state.tasks.tasks);
    const currentTeam = useAppSelector(selectCurrentTeam);
    const isInitialLoad = loading && tasks.length === 0;

    return (
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-sm sm:px-md md:px-lg py-sm sm:py-md md:py-lg overflow-hidden flex flex-col">
            <div className="mb-md flex flex-col sm:flex-row sm:items-end justify-between gap-sm sm:gap-md border-b border-outline-variant/40 pb-sm">
                <div className="flex flex-col gap-xs">
                    <h1 className="font-display text-headline-lg sm:text-headline-xl text-on-surface">Neura Flow</h1>
                    <p className="text-body-sm text-on-surface-variant">
                        {currentTeam ? currentTeam.name : 'Select a team'}
                    </p>
                </div>
                <Link
                    href="/create"
                    className="rounded-md px-md py-sm min-h-[44px] flex items-center justify-center text-label-md uppercase tracking-wider font-semibold bg-primary-container text-on-primary-container transition-colors hover:brightness-95"
                >
                    New task
                </Link>
            </div>

            {isInitialLoad ? (
                <div className="flex flex-1 flex-col md:flex-row gap-sm md:gap-gutter md:overflow-x-auto md:snap-x md:snap-mandatory pb-md">
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
                    <div className="flex flex-1 flex-col md:flex-row gap-sm md:gap-gutter md:overflow-x-auto md:snap-x md:snap-mandatory pb-md">
                        {COLUMNS.map((col) => (
                            <KanbanColumn key={col.id} status={col.id} title={col.title} />
                        ))}
                    </div>
                </BoardDnDProvider>
            )}
        </main>
    );
}