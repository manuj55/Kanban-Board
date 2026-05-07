'use client';

import Link from 'next/link';
import TeamSwitcher from '@/components/team/TeamSwitcher';
import UserMenu from '@/components/team/UserMenu';

interface ProtectedHeaderProps {
  currentPage: 'board' | 'create-task';
  showNewTaskButton?: boolean;
}

export default function ProtectedHeader({
  currentPage,
  showNewTaskButton = true,
}: ProtectedHeaderProps) {

  return (
    <header className="w-full bg-surface">
      <div className="w-full py-md">
        {/* Row 1: Title + User Menu */}
        <div className="flex items-center justify-between gap-md mb-sm pb-sm border-b border-outline-variant px-sm sm:px-md md:px-lg">
          <div className="flex flex-col gap-xs">
            <h1 className="font-display text-headline-lg sm:text-headline-xl text-on-surface">
              Neura Flow
            </h1>
          </div>
          <UserMenu />
        </div>


        {/* Row 2: Breadcrumb + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm sm:gap-md pt-xs max-w-[1280px] mx-auto px-sm sm:px-md md:px-lg">
          {/* Breadcrumb */}

          <nav aria-label="Breadcrumb" className="flex items-center gap-xs text-body-sm text-on-surface-variant px-sm sm:px-md md:px-lg mb-sm">
            {currentPage === 'board' ? (
              <span>Board</span>
            ) : (
              <>
                <Link
                  href="/"
                  className="hover:text-on-surface hover:underline transition-colors"
                >
                  Board
                </Link>
                <span>/</span>
                <span>Create Task</span>
              </>
            )}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-sm">
            <span className="text-body-md text-on-surface-variant">Team:</span>
            <TeamSwitcher />
            {showNewTaskButton && (
              <Link
                href="/create"
                className="rounded-md px-md py-sm min-h-[44px] flex items-center justify-center text-label-md uppercase tracking-wider font-semibold bg-primary-container text-on-primary-container transition-colors hover:brightness-95"
              >
                New task
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
