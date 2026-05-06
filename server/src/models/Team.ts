import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'

// ─── Team member embedded subdocument ───
export interface ITeamMember {
  userId: Types.ObjectId
  role: 'owner' | 'member'
  joinedAt: Date
}

// ─── Interface: plain data shape ───
export interface ITeam {
  name: string
  createdBy: Types.ObjectId
  members: ITeamMember[]
}

// ─── Interface: Mongoose document ───
export interface ITeamDocument extends ITeam, Document {
  createdAt: Date
  updatedAt: Date
}

// ─── Member subdocument schema ───
const teamMemberSchema = new Schema<ITeamMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: ['owner', 'member'],
        message: '{VALUE} is not a valid role',
      },
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
)

// ─── Team schema ───
const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [teamMemberSchema],
      default: [],
    },
  },
  { timestamps: true },
)

// Index for efficient queries
teamSchema.index({ 'members.userId': 1 })
teamSchema.index({ createdBy: 1 })

export const Team = model<ITeam>('Team', teamSchema)
