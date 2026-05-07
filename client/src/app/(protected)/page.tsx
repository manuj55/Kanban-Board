import KanbanBoard from '@/components/board/KanbanBoard';
import ProtectedHeader from '@/components/layout/ProtectedHeader';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProtectedHeader currentPage="board" />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-sm sm:px-md md:px-lg py-sm sm:py-md md:py-lg overflow-hidden flex flex-col">
        <KanbanBoard />
      </main>
    </div>
  );
}
