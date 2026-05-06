'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCurrentUser,
  selectCurrentUser,
  selectAuthLoading,
} from '@/store/slices/authSlice';
import { fetchTeams } from '@/store/slices/teamsSlice';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        await dispatch(fetchCurrentUser()).unwrap();
        await dispatch(fetchTeams()).unwrap();
      } catch {
        // Errors handled by individual slices
      } finally {
        setChecked(true);
      }
    };
    restoreSession();
  }, [dispatch]);

  // Redirect to login if unauthenticated after check
  useEffect(() => {
    if (checked && !user && !loading) {
      const currentPath = window.location.pathname;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [checked, user, loading, router]);

  // Show loading spinner while checking session
  if (!checked || (loading && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-md">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-sm text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
