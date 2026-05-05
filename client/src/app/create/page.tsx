import CreateTaskForm from '@/components/forms/CreateTaskForm';

export default function CreateTaskPage() {
    return (
        <div className="min-h-screen bg-background text-on-surface">
            <main className="w-full max-w-[720px] mx-auto px-lg py-xl flex flex-col gap-lg">
                <header className="flex flex-col gap-sm">
                    <h1 className="font-display text-headline-lg text-on-surface">
                        Create task
                    </h1>
                    <p className="text-body-md text-on-surface-variant">
                        Add a new task to your board with a clear title, status, and due date.
                    </p>
                </header>

                <CreateTaskForm />
            </main>
        </div>
    );
}
