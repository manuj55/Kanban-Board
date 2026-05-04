import React from 'react';
import KanbanColumn from './KanbanColumn';
import BoardDnDProvider from './BoardDnDProvider';

export default function KanbanBoard() {
    const COLUMNS = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
    ] as const;

    return (
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-lg py-xl overflow-hidden flex flex-col">
            <div className="mb-lg">
                <h1 className="font-display text-headline-xl text-on-surface">Neura Flow</h1>
                <p className="text-body-lg text-on-surface-variant">Cognitive Task Pipeline</p>
            </div>

            <BoardDnDProvider>
                <div className="flex flex-1 gap-gutter overflow-x-auto pb-md">
                    {COLUMNS.map((col) => (
                        <KanbanColumn key={col.id} status={col.id} title={col.title} />
                    ))}
                </div>
            </BoardDnDProvider>
        </main>
    );
}