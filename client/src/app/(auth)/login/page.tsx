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
  loginUser,
  selectAuthLoading,
  selectIsAuthenticated,
  clearError,
} from '@/store/slices/authSlice';
import type { LoginCredentials } from '@/types/auth';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
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

  const onSubmit = async (values: LoginFormValues) => {
    const credentials: LoginCredentials = {
      email: values.email,
      password: values.password,
    };

    try {
      await dispatch(loginUser(credentials)).unwrap();
      toast.success('Logged in successfully');
      const redirect = searchParams.get('redirect') || '/';
      router.replace(redirect);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      toast.error(message);
    }
  };

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-lg py-xl">
      <div className="mb-lg">
        <h1 className="font-display text-h2 text-on-surface mb-xs">Sign In</h1>
        <p className="text-body-md text-on-surface-variant">
          Welcome back to Neura Flow
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md">
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
            placeholder="Enter your password"
            autoComplete="current-password"
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
            loadingText="Signing in..."
          >
            Sign In
          </Button>

          <p className="text-center text-body-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
