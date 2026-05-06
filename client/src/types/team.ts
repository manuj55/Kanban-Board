// ═══════════════════════════════════════════════════════════════
// Team Types (Client)
// ═══════════════════════════════════════════════════════════════

// Team member role
export type TeamRole = 'owner' | 'member';

// Team member with full user details
export interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: TeamRole;
  joinedAt: string;
}

// Full team representation
export interface Team {
  id: string; // Backend _id normalized
  name: string;
  createdBy: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

// Form data for creating a team
export interface CreateTeamInput {
  name: string;
}

// Form data for adding a member
export interface AddMemberInput {
  email: string;
}

// Redux teams state shape
export interface TeamsState {
  teams: Team[];
  currentTeamId: string | null; // Selected team for board view
  loading: boolean;
  error: string | null;
}
