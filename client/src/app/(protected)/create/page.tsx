import CreateTaskForm from '@/components/forms/CreateTaskForm';
import ProtectedHeader from '@/components/layout/ProtectedHeader';

export default function CreateTaskPage() {
    return (
        <div className="min-h-screen bg-background text-on-surface">
            <ProtectedHeader currentPage="create-task" showNewTaskButton={false} />
            <h1 className="font-display text-headline-lg text-on-surface text-center mt-lg">
                Create new task
            </h1>
            <main className="w-full max-w-[720px] mx-auto px-md md:px-lg py-md md:py-lg flex flex-col gap-md">
                <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-lg">
                    <CreateTaskForm />
                </section>
            </main>
        </div>
    );
}
