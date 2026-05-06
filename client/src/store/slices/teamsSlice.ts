import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import type { TeamsState, Team, CreateTeamInput, AddMemberInput } from '@/types/team'
import * as teamsApi from '@/lib/api/teams'
import { logoutUser } from './authSlice'

const initialState: TeamsState = {
  teams: [],
  currentTeamId: null,
  loading: false,
  error: null,
}

// ─── Thunks ───

export const fetchTeams = createAsyncThunk<Team[], void>(
  'teams/fetchTeams',
  async () => {
    const teams = await teamsApi.fetchTeams()
    return teams
  },
)

export const createTeam = createAsyncThunk<Team, CreateTeamInput>(
  'teams/createTeam',
  async (input) => {
    const team = await teamsApi.createTeam(input)
    return team
  },
)

export const addTeamMember = createAsyncThunk<
  Team,
  { teamId: string; input: AddMemberInput }
>('teams/addTeamMember', async ({ teamId, input }) => {
  const team = await teamsApi.addTeamMember(teamId, input)
  return team
})

export const removeTeamMember = createAsyncThunk<
  Team,
  { teamId: string; userId: string }
>('teams/removeTeamMember', async ({ teamId, userId }) => {
  const team = await teamsApi.removeTeamMember(teamId, userId)
  return team
})

// ─── Slice ───

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setCurrentTeamId: (state, action: PayloadAction<string | null>) => {
      state.currentTeamId = action.payload
    },
    clearTeams: (state) => {
      state.teams = []
      state.currentTeamId = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch teams
    builder.addCase(fetchTeams.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
      state.loading = false
      state.teams = action.payload
      // Auto-select first team if none selected
      if (!state.currentTeamId && action.payload.length > 0) {
        state.currentTeamId = action.payload[0].id
      }
    })
    builder.addCase(fetchTeams.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch teams'
    })

    // Create team
    builder.addCase(createTeam.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createTeam.fulfilled, (state, action: PayloadAction<Team>) => {
      state.loading = false
      state.teams.push(action.payload)
      // Set newly created team as current
      state.currentTeamId = action.payload.id
    })
    builder.addCase(createTeam.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to create team'
    })

    // Add team member
    builder.addCase(addTeamMember.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(addTeamMember.fulfilled, (state, action: PayloadAction<Team>) => {
      state.loading = false
      const index = state.teams.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.teams[index] = action.payload
      }
    })
    builder.addCase(addTeamMember.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to add team member'
    })

    // Remove team member
    builder.addCase(removeTeamMember.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(removeTeamMember.fulfilled, (state, action: PayloadAction<Team>) => {
      state.loading = false
      const index = state.teams.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.teams[index] = action.payload
      }
    })
    builder.addCase(removeTeamMember.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to remove team member'
    })

    // Listen to logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.teams = []
      state.currentTeamId = null
      state.error = null
    })
  },
})

export const { setCurrentTeamId, clearTeams } = teamsSlice.actions
export const teamsReducer = teamsSlice.reducer

// ─── Selectors ───

export const selectAllTeams = (state: RootState): Team[] => state.teams.teams

export const selectCurrentTeamId = (state: RootState): string | null =>
  state.teams.currentTeamId

export const selectCurrentTeam = createSelector(
  [selectAllTeams, selectCurrentTeamId],
  (teams, currentTeamId) => {
    if (!currentTeamId) return null
    return teams.find((t) => t.id === currentTeamId) ?? null
  },
)

export const selectTeamsLoading = (state: RootState): boolean => state.teams.loading

export const selectTeamsError = (state: RootState): string | null => state.teams.error
