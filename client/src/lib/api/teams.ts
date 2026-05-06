import { api } from '../api'
import type { Team, CreateTeamInput, AddMemberInput } from '@/types/team'

interface ApiTeam {
  _id: string
  name: string
  members: Array<{
    userId: {
      _id: string
      name: string
      email: string
    }
    role: 'owner' | 'member'
    joinedAt: string
  }>
  createdBy: string
  createdAt: string
  updatedAt: string
}

function normalizeTeam(apiTeam: ApiTeam): Team {
  return {
    id: apiTeam._id,
    name: apiTeam.name,
    members: apiTeam.members.map((m) => ({
      userId: m.userId._id,
      email: m.userId.email,
      name: m.userId.name,
      role: m.role,
      joinedAt: m.joinedAt,
    })),
    createdBy: apiTeam.createdBy,
    createdAt: apiTeam.createdAt,
    updatedAt: apiTeam.updatedAt,
  }
}

export async function fetchTeams(): Promise<Team[]> {
  const response = await api.get<{ teams: ApiTeam[] }>('/teams')
  return response.data.teams.map(normalizeTeam)
}

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const response = await api.post<{ team: ApiTeam }>('/teams', input)
  return normalizeTeam(response.data.team)
}

export async function addTeamMember(
  teamId: string,
  input: AddMemberInput,
): Promise<Team> {
  const response = await api.post<{ team: ApiTeam }>(
    `/teams/${teamId}/members`,
    input,
  )
  return normalizeTeam(response.data.team)
}

export async function removeTeamMember(
  teamId: string,
  userId: string,
): Promise<Team> {
  const response = await api.delete<{ team: ApiTeam }>(
    `/teams/${teamId}/members/${userId}`,
  )
  return normalizeTeam(response.data.team)
}
