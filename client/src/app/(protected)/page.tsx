import KanbanBoard from '@/components/board/KanbanBoard';

export default function Home() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <KanbanBoard />
    </div>
  )
}
