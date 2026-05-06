'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser, selectCurrentUser } from '@/store/slices/authSlice';
import { toast } from 'sonner';

export default function UserMenu() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      router.replace('/login');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to logout';
      toast.error(message);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center justify-center w-8 h-8 bg-primary-container text-on-primary-container rounded-full text-label-sm font-semibold hover:brightness-95 transition-colors"
        title={user.name}
      >
        {user.name.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          role="menu"
          className="absolute top-full mt-xs right-0 min-w-[200px] bg-surface-container-lowest border border-outline-variant/40 rounded-md shadow-soft z-50 overflow-hidden"
        >
          <div className="px-md py-sm border-b border-outline-variant/40">
            <p className="text-body-md font-medium text-on-surface">{user.name}</p>
            <p className="text-body-sm text-on-surface-variant truncate">
              {user.email}
            </p>
          </div>
          <div className="py-xs">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="w-full px-md py-sm text-left text-body-md text-on-surface hover:bg-surface-container transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
