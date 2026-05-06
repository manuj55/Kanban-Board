'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectAllTeams,
  selectCurrentTeam,
  setCurrentTeamId,
  createTeam,
  selectTeamsLoading,
} from '@/store/slices/teamsSlice';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function TeamSwitcher() {
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectAllTeams);
  const currentTeam = useAppSelector(selectCurrentTeam);
  const loading = useAppSelector(selectTeamsLoading);
  const [isOpen, setIsOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
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

  const handleSwitchTeam = (teamId: string) => {
    dispatch(setCurrentTeamId(teamId));
    setIsOpen(false);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newTeamName.trim();
    if (!trimmedName) {
      toast.error('Team name is required');
      return;
    }

    setIsCreating(true);
    try {
      await dispatch(createTeam({ name: trimmedName })).unwrap();
      toast.success('Team created');
      setNewTeamName('');
      setIsOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create team';
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-sm bg-surface-container-low border border-outline-variant/40 rounded-md px-md py-sm text-body-md text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-medium">
          {currentTeam ? currentTeam.name : 'Select team'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          role="menu"
          className="absolute top-full mt-xs left-0 min-w-[240px] bg-surface-container-lowest border border-outline-variant/40 rounded-md shadow-soft z-50 overflow-hidden"
        >
          {teams.length > 0 ? (
            <div className="py-xs">
              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSwitchTeam(team.id)}
                  className="w-full flex items-center justify-between px-md py-sm text-left text-body-md text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span>{team.name}</span>
                  {currentTeam?.id === team.id && (
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-md px-md text-center text-body-sm text-on-surface-variant">
              No teams yet
            </div>
          )}

          <div className="border-t border-outline-variant/40 p-sm">
            <form onSubmit={handleCreateTeam} className="flex gap-xs">
              <Input
                type="text"
                placeholder="New team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                disabled={isCreating}
                className="flex-1 text-body-sm"
              />
              <Button
                type="submit"
                disabled={isCreating || !newTeamName.trim()}
                className="bg-primary-container text-on-primary-container hover:brightness-95 text-label-sm px-sm py-xs"
              >
                Create
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
