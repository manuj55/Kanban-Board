import CreateTaskForm from '@/components/forms/CreateTaskForm';

export default function CreateTaskPage() {
    return (
        <div className="min-h-screen bg-background text-on-surface">
            <main className="w-full max-w-[720px] mx-auto px-md md:px-lg py-md md:py-lg flex flex-col gap-md">
                <header className="flex flex-col gap-xs">
                    <h1 className="font-display text-headline-lg text-on-surface">
                        Create new task
                    </h1>
                    <p className="text-body-sm text-on-surface-variant">
                        Add a task to your board with a clear title, status, and due date.
                    </p>
                </header>

                <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-lg">
                    <CreateTaskForm />
                </section>
            </main>
        </div>
    );
}
