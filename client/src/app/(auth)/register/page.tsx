'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  registerUser,
  selectAuthLoading,
  selectIsAuthenticated,
  clearError,
} from '@/store/slices/authSlice';
import type { RegisterCredentials } from '@/types/auth';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const isBusy = loading || isSubmitting;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/';
      router.replace(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (values: RegisterFormValues) => {
    const credentials: RegisterCredentials = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      await dispatch(registerUser(credentials)).unwrap();
      toast.success('Account created successfully');
      const redirect = searchParams.get('redirect') || '/';
      router.replace(redirect);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
    }
  };

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-lg py-xl">
      <div className="mb-lg">
        <h1 className="font-display text-h2 text-on-surface mb-xs">
          Create Account
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Get started with Neura Flow
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md">
        <FormField label="Name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            hasError={!!errors.name}
            disabled={isBusy}
            {...register('name')}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            hasError={!!errors.email}
            disabled={isBusy}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            hasError={!!errors.password}
            disabled={isBusy}
            {...register('password')}
          />
        </FormField>

        <div className="flex flex-col gap-sm pt-xs">
          <Button
            type="submit"
            className="w-full bg-primary-container text-on-primary-container hover:brightness-95"
            loading={isBusy}
            loadingText="Creating account..."
          >
            Create Account
          </Button>

          <p className="text-center text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
