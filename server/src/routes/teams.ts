import { Router } from 'express'
import type { Request, Response } from 'express'
import { body } from 'express-validator'
import { Team } from '../models/Team'
import type { ITeamDocument } from '../models/Team'
import { User } from '../models/User'
import type { IUserDocument } from '../models/User'
import { ApiError } from '../utils/ApiError'
import { requireAuth } from '../middleware/auth'
import { requireTeamOwner, requireTeamMember } from '../middleware/teamAuth'
import { handleValidationErrors } from '../middleware/validation'
import type {
  TeamResponse,
  TeamMemberResponse,
  CreateTeamBody,
  AddTeamMemberBody,
} from '../types'

const router = Router()

// All team routes require authentication
router.use(requireAuth)

// Validation for create team
const validateCreateTeam = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ max: 100 })
    .withMessage('Team name cannot exceed 100 characters'),
  handleValidationErrors,
]

// Validation for add member
const validateAddMember = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  handleValidationErrors,
]

// Helper to format team response with populated member details
async function formatTeamResponse(team: ITeamDocument): Promise<TeamResponse> {
  // Fetch user details for all members
  const memberUserIds = team.members.map((m) => m.userId.toString())
  const users = (await User.find({ _id: { $in: memberUserIds } }).select(
    'email name',
  )) as IUserDocument[]

  const userMap = new Map(
    users.map((u) => [u._id.toString(), { email: u.email, name: u.name }]),
  )

  const members: TeamMemberResponse[] = team.members.map((member) => {
    const userId = member.userId.toString()
    const user = userMap.get(userId)
    return {
      userId,
      email: user?.email || 'unknown@example.com',
      name: user?.name || 'Unknown User',
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
    }
  })

  return {
    _id: team._id.toString(),
    name: team.name,
    createdBy: team.createdBy.toString(),
    members,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
  }
}

// GET /api/teams — List all teams for current user
router.get('/', async (req: Request, res: Response) => {
  const userId = req.user!._id

  // Find all teams where user is a member
  const teams = (await Team.find({
    'members.userId': userId,
  }).sort({ updatedAt: -1 })) as unknown as ITeamDocument[]

  const formattedTeams = await Promise.all(
    teams.map((team) => formatTeamResponse(team)),
  )

  res.json({ teams: formattedTeams })
})

// POST /api/teams — Create new team (creator becomes owner)
router.post(
  '/',
  validateCreateTeam,
  async (req: Request, res: Response) => {
    const { name } = req.body as CreateTeamBody
    const userId = req.user!._id

    const team = (await Team.create({
      name,
      createdBy: userId,
      members: [
        {
          userId,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
    })) as unknown as ITeamDocument

    const formattedTeam = await formatTeamResponse(team)

    res.status(201).json({ team: formattedTeam })
  },
)

// GET /api/teams/:id — Get team details
router.get('/:id', requireTeamMember, async (req: Request, res: Response) => {
  const team = (await Team.findById(req.params.id)) as ITeamDocument | null

  if (!team) {
    throw ApiError.notFound('Team not found')
  }

  const formattedTeam = await formatTeamResponse(team)

  res.json(formattedTeam)
})

// POST /api/teams/:id/members — Add member to team (owner only)
router.post(
  '/:id/members',
  requireTeamOwner,
  validateAddMember,
  async (req: Request, res: Response) => {
    const { email } = req.body as AddTeamMemberBody
    const teamId = req.params.id

    // Find user by email
    const user = (await User.findOne({
      email: email.toLowerCase(),
    })) as IUserDocument | null
    if (!user) {
      throw ApiError.notFound('User not found')
    }

    const team = (await Team.findById(teamId)) as ITeamDocument | null
    if (!team) {
      throw ApiError.notFound('Team not found')
    }

    // Check if user is already a member
    const isAlreadyMember = team.members.some(
      (member: { userId: { toString(): string } }) =>
        member.userId.toString() === user._id.toString(),
    )

    if (isAlreadyMember) {
      throw ApiError.badRequest('User is already a member of this team')
    }

    // Add member
    team.members.push({
      userId: user._id,
      role: 'member',
      joinedAt: new Date(),
    })

    await team.save()

    const formattedTeam = await formatTeamResponse(team)

    res.json(formattedTeam)
  },
)

// DELETE /api/teams/:id/members/:userId — Remove member (owner or self)
router.delete(
  '/:id/members/:userId',
  requireTeamMember,
  async (req: Request, res: Response) => {
    const teamId = req.params.id
    const targetUserId = req.params.userId
    const currentUserId = req.user!._id.toString()

    const team = (await Team.findById(teamId)) as ITeamDocument | null
    if (!team) {
      throw ApiError.notFound('Team not found')
    }

    type TeamMember = { userId: { toString(): string }; role: string }

    // Check if current user is owner or removing themselves
    const currentUserMember = team.members.find(
      (m: TeamMember) => m.userId.toString() === currentUserId,
    )
    const isOwner = currentUserMember?.role === 'owner'
    const isSelf = currentUserId === targetUserId

    if (!isOwner && !isSelf) {
      throw ApiError.unauthorized(
        'Only team owners can remove other members',
      )
    }

    // Prevent removing the last owner
    const ownerCount = team.members.filter((m: TeamMember) => m.role === 'owner')
      .length
    const targetMember = team.members.find(
      (m: TeamMember) => m.userId.toString() === targetUserId,
    )

    if (targetMember?.role === 'owner' && ownerCount === 1) {
      throw ApiError.badRequest('Cannot remove the last owner from the team')
    }

    // Remove member
    team.members = team.members.filter(
      (m: TeamMember) => m.userId.toString() !== targetUserId,
    )

    await team.save()

    const formattedTeam = await formatTeamResponse(team)

    res.json(formattedTeam)
  },
)

export { router as teamRoutes }
