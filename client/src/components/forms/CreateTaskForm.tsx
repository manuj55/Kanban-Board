'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    createTask,
    selectTasksError,
    selectTasksLoading,
} from '@/store/slices/tasksSlice';
import type { CreateTaskInput, TaskStatus } from '@/types';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
] as const satisfies ReadonlyArray<{ value: TaskStatus; label: string }>;

const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(100, 'Title must be 100 characters or fewer'),
    status: z.enum(['todo', 'in-progress', 'done']),
    description: z
        .string()
        .trim()
        .max(500, 'Description must be 500 characters or fewer')
        .optional(),
    dueDate: z
        .string()
        .refine((value) => !Number.isNaN(Date.parse(value)), 'Due date is required')
        .refine((value) => {
            const date = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }, 'Due date cannot be in the past'),
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export default function CreateTaskForm() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const loading = useAppSelector(selectTasksLoading);
    const error = useAppSelector(selectTasksError);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: '',
            status: 'todo',
            description: '',
            dueDate: '',
        },
    });

    const isBusy = loading || isSubmitting;

    const onSubmit = async (values: CreateTaskFormValues) => {
        const description = values.description?.trim();
        const payload: CreateTaskInput = {
            title: values.title,
            status: values.status,
            description: description && description.length > 0 ? description : undefined,
            dueDate: new Date(`${values.dueDate}T00:00:00`).toISOString(),
        };

        try {
            await dispatch(createTask(payload)).unwrap();
            toast.success('Task created');
            router.push('/');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create task';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md">
            {error && (
                <div className="border border-error/40 bg-error-container text-on-error-container text-body-sm rounded px-md py-sm">
                    {error}
                </div>
            )}

            <FormField label="Title *" htmlFor="title" error={errors.title?.message}>
                <Input
                    id="title"
                    placeholder="Task title"
                    autoComplete="off"
                    hasError={!!errors.title}
                    disabled={isBusy}
                    {...register('title')}
                />
            </FormField>

            <FormField label="Status" htmlFor="status" error={errors.status?.message}>
                <Select id="status" hasError={!!errors.status} disabled={isBusy} {...register('status')}>
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </FormField>

            <FormField
                label="Description"
                htmlFor="description"
                helperText="Optional"
                error={errors.description?.message}
            >
                <Textarea
                    id="description"
                    rows={4}
                    placeholder="Add context or details"
                    hasError={!!errors.description}
                    disabled={isBusy}
                    {...register('description')}
                />
            </FormField>

            <FormField label="Due date *" htmlFor="dueDate" error={errors.dueDate?.message}>
                <Input
                    id="dueDate"
                    type="date"
                    hasError={!!errors.dueDate}
                    disabled={isBusy}
                    {...register('dueDate')}
                />
            </FormField>

            <div className="flex items-center justify-end gap-sm pt-xs">
                <Button
                    type="button"
                    className="border border-outline-variant/40 text-on-surface bg-transparent hover:bg-surface-container-low"
                    onClick={() => router.push('/')}
                    disabled={isBusy}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-primary-container text-on-primary-container hover:brightness-95"
                    loading={isBusy}
                    loadingText="Creating…"
                >
                    Create task
                </Button>
            </div>
        </form>
    );
}
