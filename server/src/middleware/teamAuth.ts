import type { Request, Response, NextFunction } from 'express'
import { Team } from '../models/Team'
import type { ITeamDocument } from '../models/Team'
import { ApiError } from '../utils/ApiError'

/**
 * Middleware to ensure user is a member of the team
 * Requires requireAuth to be called first
 */
export const requireTeamMember = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const teamId = req.params.id
    const userId = req.user?._id.toString()

    if (!userId) {
      throw ApiError.unauthorized('Authentication required')
    }

    const team = (await Team.findById(teamId)) as ITeamDocument | null
    if (!team) {
      throw ApiError.notFound('Team not found')
    }

    const isMember = team.members.some(
      (member: { userId: { toString(): string } }) =>
        member.userId.toString() === userId,
    )

    if (!isMember) {
      throw ApiError.unauthorized('You are not a member of this team')
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Middleware to ensure user is the owner of the team
 * Requires requireAuth to be called first
 */
export const requireTeamOwner = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const teamId = req.params.id
    const userId = req.user?._id.toString()

    if (!userId) {
      throw ApiError.unauthorized('Authentication required')
    }

    const team = (await Team.findById(teamId)) as ITeamDocument | null
    if (!team) {
      throw ApiError.notFound('Team not found')
    }

    const isOwner = team.members.some(
      (member: { userId: { toString(): string }; role: string }) =>
        member.userId.toString() === userId && member.role === 'owner',
    )

    if (!isOwner) {
      throw ApiError.unauthorized('Only team owners can perform this action')
    }

    next()
  } catch (error) {
    next(error)
  }
}
