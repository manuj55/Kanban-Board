import React from 'react';
import Link from 'next/link';
import KanbanColumn from './KanbanColumn';
import BoardDnDProvider from './BoardDnDProvider';

export default function KanbanBoard() {
    const COLUMNS = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
    ] as const;

    return (
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-md md:px-lg py-md md:py-lg overflow-hidden flex flex-col">
            <div className="mb-md flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant/40 pb-sm">
                <div className="flex flex-col gap-xs">
                    <h1 className="font-display text-headline-xl text-on-surface">Neura Flow</h1>
                    <p className="text-body-sm text-on-surface-variant">Cognitive Task Pipeline</p>
                </div>
                <Link
                    href="/create"
                    className="rounded-md px-md py-sm text-label-md uppercase tracking-wider font-semibold bg-primary-container text-on-primary-container transition-colors hover:brightness-95"
                >
                    New task
                </Link>
            </div>

            <BoardDnDProvider>
                <div className="flex flex-1 flex-col md:flex-row gap-gutter md:overflow-x-auto pb-md">
                    {COLUMNS.map((col) => (
                        <KanbanColumn key={col.id} status={col.id} title={col.title} />
                    ))}
                </div>
            </BoardDnDProvider>
        </main>
    );
}