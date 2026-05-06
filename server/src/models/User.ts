import { Schema, model } from 'mongoose'
import type { Document } from 'mongoose'
import bcrypt from 'bcryptjs'

// ─── Interface: plain data shape ───
export interface IUser {
  email: string
  password: string
  name: string
}

// ─── Interface: Mongoose document (adds _id, timestamps, methods) ───
export interface IUserDocument extends IUser, Document {
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

// ─── Schema ───
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
  },
  { timestamps: true },
)

// Pre-save hook: hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Instance method: compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Index for efficient email lookups
userSchema.index({ email: 1 })

export const User = model<IUser>('User', userSchema)
